# Settings Page - Browser Testing Checklist

## Pre-Test Setup

### 1. Start Backend Server
```powershell
cd d:\LifeMind-AI\backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

### 2. Start Frontend Development Server
```powershell
cd d:\LifeMind-AI\frontend
npm run dev
```

### 3. Access Application
- URL: http://localhost:5173
- Login: `test@example.com` / `password123`
- Navigate to Settings page

---

## Testing Checklist

### ✅ Profile Section

#### Load Profile Data
- [ ] Name field shows user's full name
- [ ] Email field shows user's email (read-only)
- [ ] Bio field shows existing bio (if any)
- [ ] Profile picture shows if one exists

#### Update Profile
- [ ] Change full name → Type new name
- [ ] Edit bio → Type text (max 500 chars)
- [ ] Character counter shows: X/500 characters
- [ ] Click "Save Changes" button
- [ ] Success toast appears: "Profile saved successfully"
- [ ] "Unsaved changes" indicator disappears
- [ ] Refresh page → Verify data persists

#### Upload Profile Picture
- [ ] Click "Choose Photo" button
- [ ] Select image file (JPG, PNG, GIF)
- [ ] Preview shows uploaded image
- [ ] Click "Save Changes"
- [ ] Success toast appears
- [ ] Refresh page → Picture persists

---

### ✅ Appearance Section

#### Theme Selection
- [ ] Click "Light" theme button
- [ ] UI instantly changes to light theme
- [ ] Click "Dark" theme button
- [ ] UI instantly changes to dark theme
- [ ] Click "System" theme button
- [ ] UI follows system preference

#### Accent Color
- [ ] Click on any color swatch
- [ ] UI accent color changes instantly
- [ ] Selected color shows checkmark
- [ ] Try multiple colors → Each updates UI immediately

#### Font & Density
- [ ] Change Font Size → Select "Small", "Medium", "Large"
- [ ] Change UI Density → Select "Compact", "Comfortable", "Spacious"
- [ ] Click "Save Changes"
- [ ] Success toast appears

---

### ✅ Notifications Section

#### Master Toggle
- [ ] Toggle "Enable All Notifications" OFF
- [ ] All child toggles become disabled (grayed out)
- [ ] Toggle "Enable All Notifications" ON
- [ ] Child toggles become enabled again

#### Individual Toggles
- [ ] Toggle "Habit Reminders" → Verify state changes
- [ ] Toggle "Task Reminders" → Verify state changes
- [ ] Toggle "Meeting Reminders" → Verify state changes
- [ ] Toggle "Daily Summary" → Verify state changes
- [ ] Toggle "Browser Notifications" → Verify state changes
- [ ] Toggle "Sound Notifications" → Verify state changes

#### Save & Persist
- [ ] Make changes → "Unsaved changes" indicator appears
- [ ] Click "Save Changes"
- [ ] Success toast: "Settings saved successfully"
- [ ] Refresh page → Settings persist

---

### ✅ Email Section

#### Email Master Toggle
- [ ] Toggle "Email Notifications" OFF
- [ ] All email child toggles become disabled
- [ ] Toggle "Email Notifications" ON
- [ ] Child toggles become enabled

#### Individual Email Preferences
- [ ] Toggle "Welcome Email"
- [ ] Toggle "Habit Reminder Emails"
- [ ] Toggle "Task Reminder Emails"
- [ ] Toggle "Meeting Reminder Emails"
- [ ] Toggle "Daily Summary Email"

#### Send Test Email
- [ ] Click "Send Test" button
- [ ] Button shows loading state: "Sending..."
- [ ] Success toast: "Test email sent! Check your inbox."
- [ ] Check email inbox → Verify test email arrived
- [ ] Email has proper subject: "Test Email - LifeMind AI Connection Verification"
- [ ] Email contains user's name

#### Save Email Preferences
- [ ] Make changes → Click "Save Changes"
- [ ] Success toast appears
- [ ] Refresh page → Preferences persist

---

### ✅ Reminders Section

#### Time Settings
- [ ] Click on "Default Reminder Time" field
- [ ] Select a time (e.g., 09:00 AM)
- [ ] Change "Meeting Alert Before" dropdown
- [ ] Select: 5, 15, 30, or 60 minutes

#### Timezone
- [ ] Open "Timezone" dropdown
- [ ] Select different timezone (UTC, EST, PST, etc.)
- [ ] Click "Save Changes"
- [ ] Success toast appears
- [ ] Refresh page → Settings persist

---

### ✅ AI Coach Section

#### Master AI Toggle
- [ ] Toggle "Enable AI Coach" OFF
- [ ] All AI features become disabled
- [ ] Toggle "Enable AI Coach" ON
- [ ] AI features become enabled

#### Individual AI Features
- [ ] Toggle "Daily AI Insights"
- [ ] Toggle "Expense Analysis"
- [ ] Toggle "Productivity Suggestions"
- [ ] Toggle "Wellness Recommendations"

#### Save AI Settings
- [ ] Click "Save Changes"
- [ ] Success toast appears
- [ ] Refresh page → Settings persist

---

### ✅ Security Section

#### Two-Factor Authentication
- [ ] Toggle "Two-Factor Authentication"
- [ ] Click "Save Changes"
- [ ] Success toast appears

#### Session Timeout
- [ ] Open "Session Timeout" dropdown
- [ ] Select timeout: 5 min, 15 min, 30 min, 1 hour, 2 hours, 8 hours, 24 hours
- [ ] Click "Save Changes"
- [ ] Success toast appears

#### Change Password
- [ ] Fill "Current Password" field
- [ ] Click eye icon → Password becomes visible
- [ ] Fill "New Password" field (min 8 chars, uppercase, lowercase, digit)
- [ ] Fill "Confirm New Password" field

**Test Validation:**
- [ ] Try mismatched passwords → Error: "New passwords do not match"
- [ ] Try weak password (< 8 chars) → Error shown
- [ ] Try password without uppercase → Error shown
- [ ] Try password without digits → Error shown

**Successful Change:**
- [ ] Fill valid password in all fields
- [ ] Click "Change Password" button
- [ ] Button shows: "Changing..." with spinner
- [ ] Success toast: "Password changed successfully"
- [ ] Password fields clear automatically
- [ ] Logout → Login with new password → Verify it works

#### Logout All Devices
- [ ] Click "Logout All" button
- [ ] Button shows loading state: "Logging out..."
- [ ] Success toast: "Logged out from all devices"

---

### ✅ Data Management Section

#### Export All Data
- [ ] Click "Export" button (under "Export All Data")
- [ ] Button shows loading state: "Exporting..."
- [ ] Success toast: "Data export initiated — check your email for the download link"

#### Export Individual Data Types
- [ ] Click "Export CSV" under "Export Expenses"
- [ ] Click "Export CSV" under "Export Habits & Tasks"
- [ ] Verify each shows loading state and success toast

#### Delete Account
- [ ] Click "Delete" button in Danger Zone
- [ ] Confirmation modal appears
- [ ] Modal shows warning message
- [ ] Try clicking "Delete My Account" without password
- [ ] Error: "Please enter your password to confirm"

**Test Password Validation:**
- [ ] Enter incorrect password → Click "Delete My Account"
- [ ] Error toast: "Incorrect password. Account deletion cancelled."

**Successful Deletion:**
- [ ] Enter correct password
- [ ] Click "Delete My Account"
- [ ] Button shows: "Deleting..." with spinner
- [ ] Success toast: "Account deleted successfully"
- [ ] Auto-logout occurs after 2 seconds
- [ ] Try logging in → Account no longer exists

---

## UI/UX Testing

### Loading States
- [ ] Page shows loading spinner during initial load
- [ ] "Save Changes" button shows spinner when saving
- [ ] Individual action buttons show loading states
- [ ] All loading states have proper text ("Saving...", "Sending...", etc.)

### Toast Notifications
- [ ] Success toasts appear with green color and checkmark
- [ ] Error toasts appear with red color and alert icon
- [ ] Toasts auto-dismiss after ~3.5 seconds
- [ ] Toast close button (X) works
- [ ] Multiple toasts don't overlap

### Unsaved Changes Indicator
- [ ] Make any change → "● You have unsaved changes" appears at bottom
- [ ] Click "Save Changes" → Indicator disappears
- [ ] Click "Reset" → Changes revert, indicator disappears

### Section Navigation
- [ ] Click each sidebar section
- [ ] Active section highlights with accent color
- [ ] Chevron indicator animates smoothly
- [ ] Content transitions smoothly without flashing

### Animations
- [ ] Smooth fade-in when page loads
- [ ] Smooth transitions when switching sections
- [ ] Button hover effects work
- [ ] Theme changes animate smoothly

### Responsive Behavior
- [ ] Resize browser window
- [ ] Sidebar remains visible
- [ ] Content area adjusts properly
- [ ] No horizontal scrolling appears

---

## API Endpoint Testing (Python Script)

Run the automated test script:

```powershell
cd d:\LifeMind-AI
python test_settings_endpoints.py
```

### Expected Output
```
🧪 SETTINGS API ENDPOINT TESTING
====================================
✅ PASS - GET Profile
✅ PASS - PUT Profile
✅ PASS - GET Settings
✅ PASS - PUT Settings
✅ PASS - PUT Appearance
✅ PASS - PUT Notifications
✅ PASS - PUT Email Preferences
✅ PASS - POST Test Email
✅ PASS - PUT Security
✅ PASS - POST Logout All Devices
✅ PASS - POST Export Data

Total: 11/11 tests passed (100.0%)
🎉 All tests passed! Settings API is fully functional.
```

---

## Edge Case Testing

### Profile Section
- [ ] Enter bio with exactly 500 characters → Should work
- [ ] Try entering 501 characters → Should be blocked
- [ ] Try uploading file > 5MB → Error message
- [ ] Try uploading invalid file type (e.g., .txt) → Error message

### Appearance Section
- [ ] Rapidly click different themes → No crashes
- [ ] Rapidly click different colors → No crashes
- [ ] Save with no changes → Should show success

### Email Section
- [ ] Click "Send Test Email" multiple times rapidly
- [ ] First click should process
- [ ] Subsequent clicks should be disabled until first completes

### Security Section
- [ ] Enter current password wrong 3 times
- [ ] Try password with only lowercase → Error
- [ ] Try password with only numbers → Error
- [ ] Try password less than 8 chars → Error

### Data Management
- [ ] Click "Export" multiple times rapidly
- [ ] Only one export should process at a time
- [ ] Delete account modal should block background clicks

---

## Performance Testing

### Page Load Time
- [ ] Initial page load < 2 seconds
- [ ] Settings data loads without delay
- [ ] No flickering during load

### Save Operations
- [ ] Settings save completes < 1 second
- [ ] Profile update completes < 1 second
- [ ] No UI freezing during save

### Network Inspection
- [ ] Open browser DevTools → Network tab
- [ ] Verify API calls return 200 OK
- [ ] Verify no unnecessary duplicate calls
- [ ] Verify parallel calls (profile + settings) load together

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

Each browser should:
- [ ] Load without errors
- [ ] Display UI correctly
- [ ] All features work properly
- [ ] Animations are smooth

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Press Tab → Navigate through all sections
- [ ] Press Enter/Space → Activate buttons and toggles
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### Screen Reader
- [ ] All form fields have proper labels
- [ ] Buttons have descriptive text
- [ ] Error messages are announced
- [ ] Success messages are announced

---

## Final Verification

### Data Persistence
- [ ] Make changes → Save → Close browser
- [ ] Reopen browser → Login → Navigate to Settings
- [ ] All saved settings persist correctly

### Cross-Session
- [ ] Login from two different browsers
- [ ] Make changes in Browser A → Save
- [ ] Refresh Browser B → Changes appear

### Error Recovery
- [ ] Disconnect network → Try to save
- [ ] Error message appears
- [ ] Reconnect network → Try again → Works

---

## Sign-Off

**Tested By:** ____________________  
**Date:** ____________________  
**Browser:** ____________________  
**Result:** ☐ All Tests Passed  ☐ Issues Found

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

---

**Test Status:** Ready for Production ✅
