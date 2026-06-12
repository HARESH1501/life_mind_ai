# FRONTEND DEBUGGING TEST

## Manual Testing Steps

### 1. Open Browser Console
- Press F12 to open Developer Tools
- Go to Console tab
- Look for any errors

### 2. Test Expenses Page
1. Navigate to http://localhost:5173/expenses
2. Check console for errors
3. Click "Add Expense" button
4. Fill in form:
   - Title: "Test Expense"
   - Amount: 100
   - Category: "food"
   - Description: "Test"
5. Click "Add Expense"
6. Check console for:
   - "📤 Sending expense data to API:" message
   - "✅ API Response:" message
7. Verify expense appears in list
8. Refresh page (F5)
9. Verify expense still appears (persistence check)

### 3. Test Dashboard
1. Navigate to http://localhost:5173/dashboard
2. Check if stats are displayed:
   - Total Spent
   - Average Expense
   - Highest Expense
   - Total Expenses count
3. Check Category Breakdown section
4. Verify numbers match the expenses you created

### 4. Test Habits Page
1. Navigate to http://localhost:5173/habits
2. Click "Add Habit"
3. Fill in:
   - Name: "Test Habit"
   - Description: "Test"
   - Frequency: "daily"
4. Click "Add Habit"
5. Verify habit appears in list
6. Refresh page
7. Verify habit persists

### 5. Test Tasks Page
1. Navigate to http://localhost:5173/tasks
2. Click "Add Task"
3. Fill in:
   - Title: "Test Task"
   - Description: "Test"
   - Priority: "high"
4. Click "Add Task"
5. Verify task appears in list
6. Refresh page
7. Verify task persists

### 6. Check Network Requests
1. Open DevTools Network tab
2. Create an expense
3. Look for POST request to /api/v1/expenses
4. Check response status (should be 201)
5. Check response body contains the created expense

### 7. Check Local Storage
1. Open DevTools Application tab
2. Check Local Storage
3. Look for auth token
4. Verify token is being sent with requests

## Expected Results

✅ All CRUD operations should work
✅ Data should persist after refresh
✅ Dashboard should update with new data
✅ No console errors
✅ API responses should be 200/201
✅ Frontend should show loading states
✅ Error messages should display if API fails

## If Something Fails

1. Check browser console for errors
2. Check Network tab for failed requests
3. Check backend logs for errors
4. Verify API endpoint is responding
5. Verify JWT token is valid
6. Verify database has the data
