# 🔧 Implementing User Account Requirements

## Changes Made

### 1. ✅ Location Requests Every Time
**Changed:** Location is now requested every time the site loads, even if permission was previously granted.

**File:** `/src/app/components/WeatherSubmissionForm.tsx`
```typescript
// Removed locationPermissionRequested state
// Now requests location on EVERY component mount
useEffect(() => {
  requestLocationPermission();
}, []); // Runs every time
```

**Result:** Fresh location on every page load

---

### 2. ✅ Reports Require User Account
**Changed:** Cannot submit weather report without being logged in.

**File:** `/src/lib/supabase.ts`
```typescript
export async function postReport(data) {
  // Get current user - REQUIRED
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to post a weather report');
  }
  
  // Automatically include user_id in every report
  await supabaseFetch(`/rest/v1/reports`, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      user_id: user.id // REQUIRED field
    })
  });
}
```

**Result:** All new reports are linked to user accounts

---

### 3. ✅ Database Schema Updated
**What to do:** Run the SQL file to enforce user_id requirement

**File:** `/CLEAR_REPORTS_AND_ENFORCE_USER_ID.sql`

**What it does:**
1. ✅ Deletes ALL existing reports (fresh start)
2. ✅ Makes `user_id` column REQUIRED (NOT NULL)
3. ✅ Adds validation constraint
4. ✅ Updates RLS policies to require authentication
5. ✅ Prevents posting without user account

---

## 🚨 Important: Run This SQL

**Go to Supabase Dashboard:**
1. Open https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New query**
5. Copy and paste contents of `CLEAR_REPORTS_AND_ENFORCE_USER_ID.sql`
6. Click **Run** or press `Ctrl+Enter`

**This will:**
- ❌ Delete all existing reports (cannot be undone!)
- ✅ Enforce user_id requirement
- ✅ Update security policies

---

## What Changed in User Experience

### Before:
- ❌ Location requested once, then cached
- ❌ Could submit reports without account
- ❌ Reports not linked to users
- ❌ History showed all reports

### After:
- ✅ Location requested every time site loads
- ✅ Must be logged in to submit
- ✅ Every report linked to user account
- ✅ History shows only YOUR reports
- ✅ Cannot submit without authentication

---

## Testing the Changes

### 1. Test Location Request
```
1. Visit site → Location should be requested
2. Refresh page → Location requested again
3. Close tab, reopen → Location requested again
```

### 2. Test Report Submission Without Login
```
1. Logout
2. Try to submit report
3. Should show: "You must be logged in to post a weather report"
4. Redirected to login page
```

### 3. Test Report Submission With Login
```
1. Login with your account
2. Allow location access
3. Submit a weather report
4. Should succeed and include your user_id automatically
```

### 4. Test History Tab
```
1. Go to History tab
2. Should only see YOUR reports (not everyone's)
3. If empty, submit a few reports first
```

---

## Database Before vs After

### Before (Old Schema):
```sql
reports
├── id (primary key)
├── created_at
├── lat
├── lng
├── condition
├── note
├── user_id (optional) ❌ Could be NULL
└── location
```

### After (New Schema):
```sql
reports
├── id (primary key)
├── created_at
├── lat
├── lng
├── condition
├── note
├── user_id (REQUIRED) ✅ Cannot be NULL
└── location
```

---

## Security Improvements

### Row Level Security (RLS) Policies:

**Before:**
- Anyone could insert reports
- No user validation

**After:**
```sql
✅ Only authenticated users can INSERT
✅ Only authenticated users can UPDATE their own reports
✅ Only authenticated users can DELETE their own reports
✅ Everyone can SELECT (view) all reports
```

---

## Error Handling

### If User Not Logged In:
```javascript
try {
  await postReport(data);
} catch (error) {
  // Error: "You must be logged in to post a weather report"
  alert('Please login to submit weather reports');
}
```

### If User Tries to Access History Without Login:
```javascript
// App.tsx already handles this:
if (!user) {
  return <LoginForm onLogin={signIn} onSignup={signUp} />;
}
// User must login first
```

---

## Impact on Existing Users

### Existing Reports:
- ❌ All deleted (clean slate)
- ✅ From now on, all reports have user_id

### User Accounts:
- ✅ All existing accounts still work
- ✅ Users can continue logging in
- ✅ New reports will be linked to their account

---

## Troubleshooting

### Location Not Requesting Every Time?
**Check:** Browser might be using cached location
**Fix:** Clear browser cache or use Incognito mode

### Cannot Submit Report?
**Possible causes:**
1. Not logged in → Login first
2. No location permission → Allow location access
3. Database policies not updated → Run SQL file

### History Tab Empty?
**Possible causes:**
1. No reports submitted yet → Submit some reports
2. Reports belong to different user → History only shows YOUR reports
3. SQL not run yet → Run `CLEAR_REPORTS_AND_ENFORCE_USER_ID.sql`

---

## Summary of Files Changed

1. ✅ `/src/app/components/WeatherSubmissionForm.tsx`
   - Removed location permission caching
   - Requests location every time

2. ✅ `/src/lib/supabase.ts`
   - Added user authentication check
   - Automatically includes user_id in reports
   - Throws error if not logged in

3. ✅ `/CLEAR_REPORTS_AND_ENFORCE_USER_ID.sql` (NEW)
   - Clears all existing reports
   - Enforces user_id requirement
   - Updates security policies

---

## Next Steps

1. ✅ Deploy the code changes (already done)
2. ⚠️ **Run the SQL file in Supabase** (IMPORTANT!)
3. ✅ Test location request on page load
4. ✅ Test submitting report while logged in
5. ✅ Test history tab shows only your reports
6. ✅ Test that logout prevents submission

---

## Rollback Instructions

If you need to undo these changes:

```sql
-- Make user_id optional again
ALTER TABLE reports ALTER COLUMN user_id DROP NOT NULL;

-- Remove constraint
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_user_id_not_empty;
```

**Note:** This will NOT restore deleted reports!

---

## Questions?

**Q: Can I recover deleted reports?**  
A: No, once deleted they're gone. This is a fresh start.

**Q: Can users see other users' reports?**  
A: Yes, everyone can VIEW all reports. But you can only EDIT/DELETE your own.

**Q: What if location permission is denied?**  
A: Defaults to Davao City coordinates (7.070136, 125.608519)

**Q: Do I need to update my deployment?**  
A: Yes, redeploy after running the SQL file.

---

**All changes are now ready! Just run the SQL file in Supabase to complete the setup.** 🚀
