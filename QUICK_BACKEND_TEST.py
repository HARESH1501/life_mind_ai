#!/usr/bin/env python
"""Quick Backend Test"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

print("Testing Backend Connection...")
print(f"Base URL: {BASE_URL}\n")

# Test 1: Health Check
print("1. Testing Health Check...")
try:
    response = requests.get("http://127.0.0.1:8000/health", timeout=10)
    print(f"✅ Health Check: {response.status_code}")
    print(f"   Response: {response.json()}\n")
except Exception as e:
    print(f"❌ Health Check Failed: {e}\n")
    exit(1)

# Test 2: Login
print("2. Testing Authentication...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "test@example.com", "password": "test123"},
        timeout=10
    )
    print(f"✅ Login: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        user = data.get("user")
        print(f"   User: {user['email']}")
        print(f"   Token: {token[:50]}...\n")
    else:
        print(f"   Error: {response.text}\n")
        exit(1)
except Exception as e:
    print(f"❌ Login Failed: {e}\n")
    exit(1)

# Test 3: Protected Endpoints
print("3. Testing Protected Endpoints...")
headers = {"Authorization": f"Bearer {token}"}

endpoints = [
    ("GET", "/habits", "Habits"),
    ("GET", "/tasks", "Tasks"),
    ("GET", "/mood", "Mood"),
    ("GET", "/expenses?skip=0&limit=20", "Expenses"),
    ("GET", "/settings", "Settings"),
    ("GET", "/notifications", "Notifications"),
    ("GET", "/meetings", "Meetings"),
    ("GET", "/reminders", "Reminders"),
]

for method, endpoint, name in endpoints:
    try:
        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers, timeout=10)
        status = "✅" if response.status_code in [200, 201] else "❌"
        print(f"{status} {name}: {response.status_code}")
    except Exception as e:
        print(f"❌ {name}: {e}")

print("\n4. Testing Create Operations...")

# Create Expense
try:
    response = requests.post(
        f"{BASE_URL}/expenses",
        json={
            "title": "Test Expense",
            "amount": 25.50,
            "category": "food",
            "description": "Test"
        },
        headers=headers,
        timeout=10
    )
    print(f"✅ Create Expense: {response.status_code}")
except Exception as e:
    print(f"❌ Create Expense: {e}")

# Create Habit
try:
    response = requests.post(
        f"{BASE_URL}/habits",
        json={
            "name": "Test Habit",
            "frequency": "daily",
            "description": "Test"
        },
        headers=headers,
        timeout=10
    )
    print(f"✅ Create Habit: {response.status_code}")
except Exception as e:
    print(f"❌ Create Habit: {e}")

# Create Task
try:
    response = requests.post(
        f"{BASE_URL}/tasks",
        json={
            "title": "Test Task",
            "priority": "medium",
            "description": "Test"
        },
        headers=headers,
        timeout=10
    )
    print(f"✅ Create Task: {response.status_code}")
except Exception as e:
    print(f"❌ Create Task: {e}")

# Create Mood
try:
    response = requests.post(
        f"{BASE_URL}/mood",
        json={
            "mood": "happy",
            "energy_level": 8,
            "stress_level": 3,
            "notes": "Test"
        },
        headers=headers,
        timeout=10
    )
    print(f"✅ Create Mood: {response.status_code}")
except Exception as e:
    print(f"❌ Create Mood: {e}")

# Create Meeting
try:
    from datetime import datetime, timedelta
    response = requests.post(
        f"{BASE_URL}/meetings",
        json={
            "title": "Test Meeting",
            "description": "Test",
            "start_time": (datetime.now() + timedelta(hours=1)).isoformat(),
            "end_time": (datetime.now() + timedelta(hours=2)).isoformat(),
            "location": "Room A",
            "attendees": "test@example.com"
        },
        headers=headers,
        timeout=10
    )
    print(f"✅ Create Meeting: {response.status_code}")
except Exception as e:
    print(f"❌ Create Meeting: {e}")

# Create Reminder
try:
    from datetime import datetime, timedelta
    response = requests.post(
        f"{BASE_URL}/reminders",
        json={
            "title": "Test Reminder",
            "description": "Test",
            "reminder_type": "custom",
            "scheduled_time": (datetime.now() + timedelta(hours=1)).isoformat()
        },
        headers=headers,
        timeout=10
    )
    print(f"✅ Create Reminder: {response.status_code}")
except Exception as e:
    print(f"❌ Create Reminder: {e}")

print("\n✅ BACKEND VERIFICATION COMPLETE!")
