"""
REAL DEBUGGING TEST - Verify actual functionality
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000/api/v1"

print("=" * 80)
print("REAL END-TO-END DEBUGGING TEST")
print("=" * 80)

# Step 1: Login to get token
print("\n[STEP 1] LOGIN TO GET TOKEN")
print("-" * 80)

login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={
        "email": "test_email_system@example.com",
        "password": "TestPassword123!"
    }
)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"✅ Login successful")
    print(f"   Token: {token[:50]}...")
else:
    print(f"❌ Login failed: {login_response.status_code}")
    print(f"   Response: {login_response.text}")
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

# Step 2: Check current expenses
print("\n[STEP 2] GET CURRENT EXPENSES")
print("-" * 80)

expenses_response = requests.get(f"{BASE_URL}/expenses", headers=headers)
if expenses_response.status_code == 200:
    expenses_data = expenses_response.json()
    print(f"✅ Expenses fetched")
    print(f"   Total expenses: {expenses_data.get('total', 0)}")
    print(f"   Items: {len(expenses_data.get('items', []))}")
    print(f"   Response: {json.dumps(expenses_data, indent=2)}")
else:
    print(f"❌ Failed to fetch expenses: {expenses_response.status_code}")
    print(f"   Response: {expenses_response.text}")

# Step 3: Create a test expense
print("\n[STEP 3] CREATE TEST EXPENSE")
print("-" * 80)

test_expense = {
    "title": "Test Expense - Debug",
    "description": "Testing expense creation",
    "amount": 500.00,
    "category": "food"
}

create_response = requests.post(
    f"{BASE_URL}/expenses",
    json=test_expense,
    headers=headers
)

if create_response.status_code == 201:
    created_expense = create_response.json()
    print(f"✅ Expense created successfully")
    print(f"   ID: {created_expense.get('id')}")
    print(f"   Title: {created_expense.get('title')}")
    print(f"   Amount: {created_expense.get('amount')}")
    print(f"   Full response: {json.dumps(created_expense, indent=2)}")
else:
    print(f"❌ Failed to create expense: {create_response.status_code}")
    print(f"   Response: {create_response.text}")

# Step 4: Fetch expenses again to verify persistence
print("\n[STEP 4] VERIFY EXPENSE PERSISTENCE")
print("-" * 80)

expenses_response2 = requests.get(f"{BASE_URL}/expenses", headers=headers)
if expenses_response2.status_code == 200:
    expenses_data2 = expenses_response2.json()
    print(f"✅ Expenses fetched after creation")
    print(f"   Total expenses: {expenses_data2.get('total', 0)}")
    print(f"   Items count: {len(expenses_data2.get('items', []))}")
    
    # Check if our test expense is there
    items = expenses_data2.get('items', [])
    test_found = any(item.get('title') == 'Test Expense - Debug' for item in items)
    if test_found:
        print(f"   ✅ Test expense found in list!")
    else:
        print(f"   ❌ Test expense NOT found in list!")
        print(f"   Items: {json.dumps(items, indent=2)}")
else:
    print(f"❌ Failed to fetch expenses: {expenses_response2.status_code}")

# Step 5: Test stats endpoint
print("\n[STEP 5] TEST STATS ENDPOINT")
print("-" * 80)

stats_response = requests.get(f"{BASE_URL}/expenses/stats/summary", headers=headers)
if stats_response.status_code == 200:
    stats_data = stats_response.json()
    print(f"✅ Stats endpoint working")
    print(f"   Total spent: {stats_data.get('total_spent', 0)}")
    print(f"   Average expense: {stats_data.get('average_expense', 0)}")
    print(f"   Highest expense: {stats_data.get('highest_expense', 0)}")
    print(f"   Total expenses count: {stats_data.get('total_expenses', 0)}")
    print(f"   Category breakdown: {stats_data.get('category_breakdown', {})}")
    print(f"   Full response: {json.dumps(stats_data, indent=2)}")
else:
    print(f"❌ Stats endpoint failed: {stats_response.status_code}")
    print(f"   Response: {stats_response.text}")

# Step 6: Test habits endpoint
print("\n[STEP 6] TEST HABITS ENDPOINT")
print("-" * 80)

habits_response = requests.get(f"{BASE_URL}/habits", headers=headers)
if habits_response.status_code == 200:
    habits_data = habits_response.json()
    print(f"✅ Habits endpoint working")
    print(f"   Total habits: {len(habits_data)}")
    print(f"   Response: {json.dumps(habits_data, indent=2)}")
else:
    print(f"❌ Habits endpoint failed: {habits_response.status_code}")
    print(f"   Response: {habits_response.text}")

# Step 7: Create a test habit
print("\n[STEP 7] CREATE TEST HABIT")
print("-" * 80)

test_habit = {
    "name": "Test Habit - Debug",
    "description": "Testing habit creation",
    "frequency": "daily"
}

habit_create_response = requests.post(
    f"{BASE_URL}/habits",
    json=test_habit,
    headers=headers
)

if habit_create_response.status_code == 201:
    created_habit = habit_create_response.json()
    print(f"✅ Habit created successfully")
    print(f"   ID: {created_habit.get('id')}")
    print(f"   Name: {created_habit.get('name')}")
    print(f"   Full response: {json.dumps(created_habit, indent=2)}")
else:
    print(f"❌ Failed to create habit: {habit_create_response.status_code}")
    print(f"   Response: {habit_create_response.text}")

# Step 8: Test tasks endpoint
print("\n[STEP 8] TEST TASKS ENDPOINT")
print("-" * 80)

tasks_response = requests.get(f"{BASE_URL}/tasks", headers=headers)
if tasks_response.status_code == 200:
    tasks_data = tasks_response.json()
    print(f"✅ Tasks endpoint working")
    print(f"   Total tasks: {len(tasks_data)}")
    print(f"   Response: {json.dumps(tasks_data, indent=2)}")
else:
    print(f"❌ Tasks endpoint failed: {tasks_response.status_code}")
    print(f"   Response: {tasks_response.text}")

# Step 9: Create a test task
print("\n[STEP 9] CREATE TEST TASK")
print("-" * 80)

test_task = {
    "title": "Test Task - Debug",
    "description": "Testing task creation",
    "priority": "high",
    "due_date": (datetime.utcnow() + timedelta(days=1)).isoformat()
}

task_create_response = requests.post(
    f"{BASE_URL}/tasks",
    json=test_task,
    headers=headers
)

if task_create_response.status_code == 201:
    created_task = task_create_response.json()
    print(f"✅ Task created successfully")
    print(f"   ID: {created_task.get('id')}")
    print(f"   Title: {created_task.get('title')}")
    print(f"   Full response: {json.dumps(created_task, indent=2)}")
else:
    print(f"❌ Failed to create task: {task_create_response.status_code}")
    print(f"   Response: {task_create_response.text}")

# Step 10: Test mood endpoint
print("\n[STEP 10] TEST MOOD ENDPOINT")
print("-" * 80)

mood_response = requests.get(f"{BASE_URL}/mood", headers=headers)
if mood_response.status_code == 200:
    mood_data = mood_response.json()
    print(f"✅ Mood endpoint working")
    print(f"   Total mood entries: {len(mood_data)}")
    print(f"   Response: {json.dumps(mood_data, indent=2)}")
else:
    print(f"❌ Mood endpoint failed: {mood_response.status_code}")
    print(f"   Response: {mood_response.text}")

print("\n" + "=" * 80)
print("DEBUGGING TEST COMPLETE")
print("=" * 80)
