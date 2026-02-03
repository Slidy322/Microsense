# Supabase Setup for User-Specific Reports

## Problem
Currently, weather reports are not linked to specific users, so everyone sees all reports in their history tab.

## Solution
We need to add a `user_id` column to the `reports` table and update the Row Level Security (RLS) policies.

## Step-by-Step Instructions

### 1. Add `user_id` Column to Reports Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Add user_id column to reports table
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- Update existing reports to assign them to the first user (optional)
-- You can skip this if you want to keep existing reports unassigned
UPDATE reports 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;
```

### 2. Update Row Level Security (RLS) Policies

#### Enable RLS if not already enabled:
```sql
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
```

#### Create policies for INSERT (auto-assign user_id):
```sql
-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert their own reports" ON reports;

-- Create new INSERT policy that automatically sets user_id
CREATE POLICY "Users can insert their own reports"
ON reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

#### Create policy for SELECT (users can see all reports):
```sql
-- Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Anyone can view reports" ON reports;

-- Allow authenticated users to view all reports (for the map and dashboard)
CREATE POLICY "Authenticated users can view all reports"
ON reports FOR SELECT
TO authenticated
USING (true);
```

#### Create policy for UPDATE (users can only update their own):
```sql
-- Drop existing UPDATE policy if it exists
DROP POLICY IF EXISTS "Users can update their own reports" ON reports;

-- Allow users to update only their own reports
CREATE POLICY "Users can update their own reports"
ON reports FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### Create policy for DELETE (users can only delete their own):
```sql
-- Drop existing DELETE policy if it exists
DROP POLICY IF EXISTS "Users can delete their own reports" ON reports;

-- Allow users to delete only their own reports
CREATE POLICY "Users can delete their own reports"
ON reports FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 3. Update the INSERT Trigger (Auto-fill user_id)

Create a trigger that automatically fills the `user_id` when a report is inserted:

```sql
-- Create a function to set user_id automatically
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_user_id_trigger ON reports;

-- Create trigger to run before INSERT
CREATE TRIGGER set_user_id_trigger
BEFORE INSERT ON reports
FOR EACH ROW
EXECUTE FUNCTION set_user_id();
```

### 4. Verify Setup

Test by inserting a report:

```sql
-- This should automatically set user_id to your current user
INSERT INTO reports (lat, lng, condition, note)
VALUES (7.070200, 125.607596, 'Sunny', 'Test report');

-- Check if user_id was set correctly
SELECT id, user_id, condition, created_at 
FROM reports 
ORDER BY created_at DESC 
LIMIT 5;
```

### 5. Test the Application

1. **Log in to your app**
2. **Submit a weather report** - It should automatically be associated with your user
3. **Go to History tab** - You should only see YOUR reports
4. **Log in with a different account** - That user should see their own reports only
5. **Go to Home tab** - All users should see all reports on the map

## API Changes Already Implemented

The application code has already been updated to:

- ✅ Include `user_id` in the WeatherReport interface
- ✅ Fetch reports from the last 7 days only (clears map weekly)
- ✅ Created `loadUserReports()` function to fetch user-specific reports
- ✅ Filter History tab to show only current user's reports
- ✅ Dashboard and Map still show all community reports

## Troubleshooting

### Issue: Reports not showing in History
**Solution**: Make sure the `user_id` column has data. Run:
```sql
SELECT id, user_id, condition FROM reports WHERE user_id IS NULL;
```
If you see NULL user_ids, those reports won't show up in anyone's history.

### Issue: Can't insert reports (403 error)
**Solution**: Check that the RLS policies are set correctly:
```sql
SELECT * FROM pg_policies WHERE tablename = 'reports';
```

### Issue: Everyone still sees all reports in History
**Solution**: Make sure you're using the `loadUserReports()` function in the History tab, not `loadReports()`.

## Database Schema After Setup

```
reports table:
├── id (bigint, primary key)
├── created_at (timestamp with timezone)
├── lat (double precision)
├── lng (double precision)
├── condition (text)
├── note (text, nullable)
└── user_id (uuid, references auth.users) ← NEW COLUMN
```

## Important Notes

1. **Weekly Cleanup**: The app now only loads reports from the last 7 days. If you want to keep reports longer in the database but hide them from the map, you can adjust the `loadReports()` function.

2. **Data Retention**: Consider adding a scheduled job to delete reports older than 30 days to keep your database clean:

```sql
-- Create a function to clean old reports
CREATE OR REPLACE FUNCTION cleanup_old_reports()
RETURNS void AS $$
BEGIN
  DELETE FROM reports 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

You can set up a Supabase Edge Function or cron job to run this weekly.
