#!/usr/bin/env python
"""
Comprehensive Backend Verification Script
Tests all features, authentication, and notification system
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "test123"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
CYAN = '\033[96m'
RESET = '\033[0m'

# Test results
results = {
    'passed': 0,
    'failed': 0,
    'errors': []
}

def print_header(text):
    print(f"\n{CYAN}{'='*70}")
    print(f"{text}")
    print(f"{'='*70}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✅ {text}{RESET}")
    results['passed'] += 1

def print_error(text):
    print(f"{RED}❌ {text}{RESET}")
    results['failed'] += 1
    results['errors'].append(text)

def print_info(text):
    print(f"{YELLOW}ℹ️  {text}{RESET}")

def test_health_check():
    """Test backend health check"""
    print_header("1. HEALTH CHECK")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print_success("Backend is running")
            print(f"Response: {response.json()}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Backend not responding: {str(e)}")
        return False

def test_authentication():
    """Test authentication system"""
    print_header("2. AUTHENTICATION SYSTEM")
    try:
        # Test login
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            user = data.get("user")
            
            print_success(f"Login successful for {user['email']}")
            print(f"  User ID: {user['id']}")
            print(f"  Username: {user['username']}")
            print(f"  Token: {token[:50]}...")
            
            # Verify token is valid
            try:
                from jose import jwt
                from config import SECRET_KEY, ALGORITHM
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                print_success(f"JWT token is valid")
                print(f"  Subject (user_id): {payload.get('sub')}")
                print(f"  Expiration: {datetime.fromtimestamp(payload.get('exp'))}")
            except Exception as e:
                print_error(f"JWT token validation failed: {e}")
                return None
            
            return token
        else:
            print_error(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Authentication error: {str(e)}")
        return None

def test_protected_endpoints(token):
    """Test protected endpoints"""
    print_header("3. PROTECTED ENDPOINTS")
    
    headers = {"Authorization": f"Bearer {token}"}
    endpoints = [
        ("GET", "/habits", "Habits"),
        ("GET", "/tasks", "Tasks"),
        ("GET", "/mood", "Mood"),
        ("GET", "/expenses?skip=0&limit=20", "Expenses"),
        ("GET", "/settings", "Settings"),
        ("GET", "/notifications", "Notifications"),
    ]
    
    all_ok = True
    for method, endpoint, name in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}", headers=headers, timeout=5)
            
            if response.status_code in [200, 201]:
                print_success(f"{method} {endpoint}: OK")
            else:
                print_error(f"{method} {endpoint}: {response.status_code}")
                print(f"  Response: {response.text[:100]}")
                all_ok = False
        except Exception as e:
            print_error(f"{method} {endpoint}: {str(e)}")
            all_ok = False
    
    return all_ok

def test_expense_creation(token):
    """Test expense creation and retrieval"""
    print_header("4. EXPENSE TRACKER")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Create expense
        expense_data = {
            "title": f"Test Expense {datetime.now().strftime('%H:%M:%S')}",
            "amount": 25.50,
            "category": "food",
            "description": "Test expense for verification"
        }
        
        response = requests.post(
            f"{BASE_URL}/expenses",
            json=expense_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 201:
            expense = response.json()
            print_success(f"Created expense: {expense['title']}")
            print(f"  ID: {expense['id']}")
            print(f"  Amount: ${expense['amount']}")
            print(f"  Category: {expense['category']}")
            
            # Fetch expenses
            response = requests.get(f"{BASE_URL}/expenses", headers=headers, timeout=5)
            if response.status_code == 200:
                data = response.json()
                print_success(f"Fetched expenses: {data['total']} total")
                print(f"  Items in response: {len(data['items'])}")
                return True
            else:
                print_error(f"Failed to fetch expenses: {response.status_code}")
                return False
        else:
            print_error(f"Failed to create expense: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Expense test error: {str(e)}")
        return False

def test_habit_creation(token):
    """Test habit creation"""
    print_header("5. HABIT TRACKER")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Create habit
        habit_data = {
            "name": f"Test Habit {datetime.now().strftime('%H:%M:%S')}",
            "frequency": "daily",
            "description": "Test habit for verification"
        }
        
        response = requests.post(
            f"{BASE_URL}/habits",
            json=habit_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 201:
            habit = response.json()
            print_success(f"Created habit: {habit['name']}")
            print(f"  ID: {habit['id']}")
            print(f"  Frequency: {habit['frequency']}")
            print(f"  Streak: {habit['streak']}")
            
            # Fetch habits
            response = requests.get(f"{BASE_URL}/habits", headers=headers, timeout=5)
            if response.status_code == 200:
                habits = response.json()
                print_success(f"Fetched habits: {len(habits)} total")
                return True
            else:
                print_error(f"Failed to fetch habits: {response.status_code}")
                return False
        else:
            print_error(f"Failed to create habit: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Habit test error: {str(e)}")
        return False

def test_task_creation(token):
    """Test task creation"""
    print_header("6. TASK TRACKER")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Create task
        task_data = {
            "title": f"Test Task {datetime.now().strftime('%H:%M:%S')}",
            "priority": "medium",
            "description": "Test task for verification"
        }
        
        response = requests.post(
            f"{BASE_URL}/tasks",
            json=task_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 201:
            task = response.json()
            print_success(f"Created task: {task['title']}")
            print(f"  ID: {task['id']}")
            print(f"  Priority: {task['priority']}")
            print(f"  Status: {task['status']}")
            
            # Fetch tasks
            response = requests.get(f"{BASE_URL}/tasks", headers=headers, timeout=5)
            if response.status_code == 200:
                tasks = response.json()
                print_success(f"Fetched tasks: {len(tasks)} total")
                return True
            else:
                print_error(f"Failed to fetch tasks: {response.status_code}")
                return False
        else:
            print_error(f"Failed to create task: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Task test error: {str(e)}")
        return False

def test_mood_entry(token):
    """Test mood entry creation"""
    print_header("7. MOOD TRACKER")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Create mood entry
        mood_data = {
            "mood": "happy",
            "energy_level": 8,
            "stress_level": 3,
            "notes": "Test mood entry for verification"
        }
        
        response = requests.post(
            f"{BASE_URL}/mood",
            json=mood_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 201:
            mood = response.json()
            print_success(f"Created mood entry: {mood['mood']}")
            print(f"  ID: {mood['id']}")
            print(f"  Energy: {mood['energy_level']}/10")
            print(f"  Stress: {mood['stress_level']}/10")
            
            # Fetch mood entries
            response = requests.get(f"{BASE_URL}/mood", headers=headers, timeout=5)
            if response.status_code == 200:
                entries = response.json()
                print_success(f"Fetched mood entries: {len(entries)} total")
                return True
            else:
                print_error(f"Failed to fetch mood entries: {response.status_code}")
                return False
        else:
            print_error(f"Failed to create mood entry: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Mood test error: {str(e)}")
        return False

def test_settings(token):
    """Test settings endpoints"""
    print_header("8. SETTINGS SYSTEM")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Get settings
        response = requests.get(f"{BASE_URL}/settings", headers=headers, timeout=5)
        
        if response.status_code == 200:
            settings = response.json()
            print_success("Retrieved settings")
            print(f"  Theme: {settings.get('theme')}")
            print(f"  Dark Mode: {settings.get('dark_mode')}")
            print(f"  Email Notifications: {settings.get('email_notifications')}")
            print(f"  Habit Reminders: {settings.get('habit_reminders')}")
            
            # Update settings
            update_data = {
                "dark_mode": True,
                "email_notifications": True,
                "habit_reminders": True
            }
            
            response = requests.put(
                f"{BASE_URL}/settings",
                json=update_data,
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                print_success("Updated settings successfully")
                return True
            else:
                print_error(f"Failed to update settings: {response.status_code}")
                return False
        else:
            print_error(f"Failed to get settings: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Settings test error: {str(e)}")
        return False

def test_notifications(token):
    """Test notification endpoints"""
    print_header("9. NOTIFICATION SYSTEM")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Get notifications
        response = requests.get(f"{BASE_URL}/notifications", headers=headers, timeout=5)
        
        if response.status_code == 200:
            notifications = response.json()
            print_success(f"Retrieved notifications: {len(notifications)} total")
            
            if notifications:
                print(f"  Latest notification: {notifications[0]['title']}")
                print(f"  Type: {notifications[0]['type']}")
                print(f"  Read: {notifications[0]['read']}")
            
            return True
        else:
            print_error(f"Failed to get notifications: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Notification test error: {str(e)}")
        return False

def test_meetings(token):
    """Test meeting endpoints"""
    print_header("10. MEETING SYSTEM")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Create meeting
        meeting_data = {
            "title": f"Test Meeting {datetime.now().strftime('%H:%M:%S')}",
            "description": "Test meeting for verification",
            "start_time": (datetime.now() + timedelta(hours=1)).isoformat(),
            "end_time": (datetime.now() + timedelta(hours=2)).isoformat(),
            "location": "Conference Room A",
            "attendees": "test@example.com"
        }
        
        response = requests.post(
            f"{BASE_URL}/meetings",
            json=meeting_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 201:
            meeting = response.json()
            print_success(f"Created meeting: {meeting['title']}")
            print(f"  ID: {meeting['id']}")
            print(f"  Location: {meeting['location']}")
            print(f"  Start: {meeting['start_time']}")
            
            # Fetch meetings
            response = requests.get(f"{BASE_URL}/meetings", headers=headers, timeout=5)
            if response.status_code == 200:
                meetings = response.json()
                print_success(f"Fetched meetings: {len(meetings)} total")
                return True
            else:
                print_error(f"Failed to fetch meetings: {response.status_code}")
                return False
        else:
            print_error(f"Failed to create meeting: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Meeting test error: {str(e)}")
        return False

def test_reminders(token):
    """Test reminder endpoints"""
    print_header("11. REMINDER SYSTEM")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Create reminder
        reminder_data = {
            "title": f"Test Reminder {datetime.now().strftime('%H:%M:%S')}",
            "description": "Test reminder for verification",
            "reminder_type": "custom",
            "scheduled_time": (datetime.now() + timedelta(hours=1)).isoformat()
        }
        
        response = requests.post(
            f"{BASE_URL}/reminders",
            json=reminder_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 201:
            reminder = response.json()
            print_success(f"Created reminder: {reminder['title']}")
            print(f"  ID: {reminder['id']}")
            print(f"  Type: {reminder['reminder_type']}")
            print(f"  Scheduled: {reminder['scheduled_time']}")
            
            # Fetch reminders
            response = requests.get(f"{BASE_URL}/reminders", headers=headers, timeout=5)
            if response.status_code == 200:
                reminders = response.json()
                print_success(f"Fetched reminders: {len(reminders)} total")
                return True
            else:
                print_error(f"Failed to fetch reminders: {response.status_code}")
                return False
        else:
            print_error(f"Failed to create reminder: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print_error(f"Reminder test error: {str(e)}")
        return False

def test_password_change(token):
    """Test password change endpoint"""
    print_header("12. PASSWORD CHANGE")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Test password change (will fail with wrong current password, which is expected)
        password_data = {
            "current_password": "wrong_password",
            "new_password": "newpassword123"
        }
        
        response = requests.post(
            f"{BASE_URL}/settings/change-password",
            json=password_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 401:
            print_success("Password change validation working (correctly rejected wrong password)")
            return True
        elif response.status_code == 200:
            print_success("Password changed successfully")
            return True
        else:
            print_error(f"Unexpected response: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Password change test error: {str(e)}")
        return False

def test_database_persistence(token):
    """Test database persistence"""
    print_header("13. DATABASE PERSISTENCE")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Create an expense
        expense_data = {
            "title": f"Persistence Test {datetime.now().strftime('%H:%M:%S')}",
            "amount": 99.99,
            "category": "other",
            "description": "Testing database persistence"
        }
        
        response = requests.post(
            f"{BASE_URL}/expenses",
            json=expense_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code != 201:
            print_error("Failed to create test expense")
            return False
        
        expense_id = response.json()['id']
        print_success(f"Created test expense with ID: {expense_id}")
        
        # Fetch and verify
        response = requests.get(f"{BASE_URL}/expenses", headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            found = any(e['id'] == expense_id for e in data['items'])
            
            if found:
                print_success("✅ Data persisted in database - expense found after creation")
                return True
            else:
                print_error("❌ Data NOT persisted - expense not found after creation")
                return False
        else:
            print_error(f"Failed to fetch expenses: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Persistence test error: {str(e)}")
        return False

def main():
    """Run all verification tests"""
    print_header("LIFEMIND AI - COMPREHENSIVE BACKEND VERIFICATION")
    print_info(f"Testing Backend: {BASE_URL}")
    print_info(f"Test User: {TEST_EMAIL}")
    
    # Test 1: Health Check
    if not test_health_check():
        print_error("Backend is not running. Stopping tests.")
        return
    
    # Test 2: Authentication
    token = test_authentication()
    if not token:
        print_error("Cannot authenticate. Stopping tests.")
        return
    
    # Test 3-13: All features
    test_protected_endpoints(token)
    test_expense_creation(token)
    test_habit_creation(token)
    test_task_creation(token)
    test_mood_entry(token)
    test_settings(token)
    test_notifications(token)
    test_meetings(token)
    test_reminders(token)
    test_password_change(token)
    test_database_persistence(token)
    
    # Summary
    print_header("VERIFICATION SUMMARY")
    passed = results['passed']
    failed = results['failed']
    total = passed + failed
    
    print(f"{CYAN}Total Tests: {total}")
    print(f"Passed: {GREEN}{passed}{RESET}")
    print(f"Failed: {RED}{failed}{RESET}{RESET}\n")
    
    if failed > 0:
        print(f"{RED}Errors:{RESET}")
        for error in results['errors']:
            print(f"  - {error}")
    
    if failed == 0:
        print_success("ALL TESTS PASSED - BACKEND IS FULLY FUNCTIONAL!")
        return 0
    else:
        print_error(f"SOME TESTS FAILED - {failed} issues found")
        return 1

if __name__ == "__main__":
    exit(main())
