import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mylxpghozcxekasbniqm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bHhwZ2hvemN4ZWthc2JuaXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDAyNzksImV4cCI6MjA4NTI3NjI3OX0.-cdzpuUZ9z5KrTgCvy2v9aja9a9QaQ0BHKTfWAx5SJs";

// Create Supabase client for authentication and database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface WeatherReport {
  id: number;
  created_at: string;
  lat: number;
  lng: number;
  condition: string;
  note: string | null;
  user_id?: string;
  location?: string; // Add location field
}

export async function supabaseFetch(path: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}${path}`;
  const headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res;
}

export async function loadReports(): Promise<WeatherReport[]> {
  // Only load reports from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();
  
  const res = await supabaseFetch(
    `/rest/v1/reports?select=id,created_at,lat,lng,condition,note,user_id,location&created_at=gte.${sevenDaysAgoISO}&order=created_at.desc&limit=500`
  );
  const reports = await res.json();
  
  // Add fallback location for reports without location data
  return reports.map((report: WeatherReport) => ({
    ...report,
    location: report.location || `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`
  }));
}

export async function loadUserReports(userId: string): Promise<WeatherReport[]> {
  const res = await supabaseFetch(
    `/rest/v1/reports?select=id,created_at,lat,lng,condition,note,user_id,location&user_id=eq.${userId}&order=created_at.desc&limit=100`
  );
  const reports = await res.json();
  
  // Add fallback location for reports without location data
  return reports.map((report: WeatherReport) => ({
    ...report,
    location: report.location || `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`
  }));
}

export async function postReport(data: {
  lat: number;
  lng: number;
  condition: string;
  note: string | null;
}) {
  // Get current user - REQUIRED for posting
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to post a weather report');
  }
  
  // Use coordinates as location - NO REVERSE GEOCODING to avoid rate limits
  const location = `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`;
  
  await supabaseFetch(`/rest/v1/reports`, {
    method: "POST",
    headers: { "Prefer": "return=minimal" },
    body: JSON.stringify({
      ...data,
      location, // Include location in the submission
      user_id: user.id // REQUIRED: Link report to user account
    })
  });
}