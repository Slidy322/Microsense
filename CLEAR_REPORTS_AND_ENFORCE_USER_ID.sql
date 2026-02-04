-- =====================================================
-- CLEAR ALL REPORTS AND ENFORCE USER_ID REQUIREMENT
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Delete ALL existing reports (clears the database)
DELETE FROM reports;

-- Step 2: Make user_id column REQUIRED (NOT NULL)
ALTER TABLE reports ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Add check constraint to ensure user_id is never empty
ALTER TABLE reports ADD CONSTRAINT reports_user_id_not_empty 
CHECK (user_id IS NOT NULL AND user_id != '');

-- Step 4: Update RLS policies to REQUIRE authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own reports" ON reports;
DROP POLICY IF EXISTS "Users can view all reports" ON reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON reports;

-- Create new policy: Only authenticated users can insert reports
CREATE POLICY "Authenticated users can insert reports"
ON reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create new policy: Everyone can view all reports (read-only)
CREATE POLICY "Anyone can view reports"
ON reports FOR SELECT
TO authenticated
USING (true);

-- Create new policy: Users can only update their own reports
CREATE POLICY "Users can update own reports"
ON reports FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create new policy: Users can only delete their own reports
CREATE POLICY "Users can delete own reports"
ON reports FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Step 5: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reports'
ORDER BY ordinal_position;

-- Step 6: Check that all reports are deleted
SELECT COUNT(*) as total_reports FROM reports;

-- Step 7: Verify RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'reports';

-- =====================================================
-- SUMMARY OF CHANGES
-- =====================================================

/*
✅ All existing reports deleted
✅ user_id is now REQUIRED (NOT NULL)
✅ Cannot insert reports without user_id
✅ Only authenticated users can post reports
✅ Reports are automatically linked to user account
✅ Users can only see/edit/delete their own reports
✅ RLS (Row Level Security) enforced

IMPORTANT: From now on:
- Users MUST be logged in to post
- Every report will have a user_id
- Old reports without user_id are deleted
- History tab will only show user's own reports
*/

-- =====================================================
-- TEST THE CHANGES
-- =====================================================

-- This should work (when logged in):
-- The app will automatically add user_id

-- This should FAIL (no user_id):
-- INSERT INTO reports (lat, lng, condition, note, location) 
-- VALUES (7.07, 125.60, 'Sunny', 'Test', 'Davao City');
-- Error: null value in column "user_id" violates not-null constraint

-- =====================================================
-- ROLLBACK (if you need to undo changes)
-- =====================================================

/*
-- Only use this if you want to revert:

-- Make user_id optional again
ALTER TABLE reports ALTER COLUMN user_id DROP NOT NULL;

-- Remove the check constraint
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_user_id_not_empty;

-- You would need to recreate the old policies manually
*/
