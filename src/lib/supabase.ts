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
  const res = await supabaseFetch(
    `/rest/v1/reports?select=id,created_at,lat,lng,condition,note&order=created_at.desc&limit=100`
  );
  return res.json();
}

export async function postReport(data: {
  lat: number;
  lng: number;
  condition: string;
  note: string | null;
}) {
  await supabaseFetch(`/rest/v1/reports`, {
    method: "POST",
    headers: { "Prefer": "return=minimal" },
    body: JSON.stringify(data)
  });
}