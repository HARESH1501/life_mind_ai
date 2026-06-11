#!/usr/bin/env python
"""
Comprehensive Verification Script for LifeMind AI
Tests all backend endpoints and database operations
"""

import requests
import json
import sys
from datetime import datetime

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

def print_header(text):
    print(f"\n{CYAN}{'='*60}")
    print(f"{text}")
    print(f"{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✅ {text}{RESET}")

def print_error(text):
    print(f"{RED}❌ {text}{RESET}")

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

def test_login():
    """Test login endpoint"""
    print_header("2. AUTHENTICATION")
    try:
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
            print(f"Token: {token[:30]}...")
            print(f"User ID: {user['id']}")
            return token
        else:
            print_error(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Login error: {str(e)}")
        return None

def test_get_habits(token):
    """Test GET /habits endpoint"""
    print_header("3. GET HABITS")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/habits", headers=headers, timeout=5)
        if response.status_code == 200:
            habits = response.json()
            print_success(f"Retrieved {len(habits)} habits")
            for habit in habits[:3]:
                print(f"  - {habit['name']} (streak: {habit['streak']})")
            return True
        else:
            print_error(f"GET /habits failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"GET /habits error: {str(e)}")
        return False

def test_create_habit(token):
    """Test POST /habits endpoint"""
    print_header("4. CREATE HABIT")
    try:
        headers = {"Authorization": f"Bearer {token}"}
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
            print(f"Habit ID: {habit['id']}")
            return habit['id']
        else:
            print_error(f"POST /habits failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"POST /habits error: {str(e)}")
        return None

def test_get_tasks(token):
    """Test GET /tasks endpoint"""
    print_header("5. GET TASKS")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/tasks", headers=headers, timeout=5)
        if response.status_code == 200:
            tasks = response.json()
            print_success(f"Retrieved {len(tasks)} tasks")
            for task in tasks[:3]:
                print(f"  - {task['title']} (status: {task['status']})")
            return True
        else:
            print_error(f"GET /tasks failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"GET /tasks error: {str(e)}")
        return False

def test_create_task(token):
    """Test POST /tasks endpoint"""
    print_header("6. CREATE TASK")
    try:
        headers = {"Authorization": f"Bearer {token}"}
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
            print(f"Task ID: {task['id']}")
            return task['id']
        else:
            print_error(f"POST /tasks failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"POST /tasks error: {str(e)}")
        return None

def test_get_mood(token):
    """Test GET /mood endpoint"""
    print_header("7. GET MOOD ENTRIES")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/mood", headers=headers, timeout=5)
        if response.status_code == 200:
            entries = response.json()
            print_success(f"Retrieved {len(entries)} mood entries")
            for entry in entries[:3]:
                print(f"  - {entry['mood']} (energy: {entry['energy_level']}, stress: {entry['stress_level']})")
            return True
        else:
            print_error(f"GET /mood failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"GET /mood error: {str(e)}")
        return False

def test_create_mood(token):
    """Test POST /mood endpoint"""
    print_header("8. CREATE MOOD ENTRY")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        mood_data = {
            "mood": "Happy",
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
            entry = response.json()
            print_success(f"Created mood entry: {entry['mood']}")
            print(f"Entry ID: {entry['id']}")
            return entry['id']
        else:
            print_error(f"POST /mood failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"POST /mood error: {str(e)}")
        return None

def test_get_expenses(token):
    """Test GET /expenses endpoint"""
    print_header("9. GET EXPENSES")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{BASE_URL}/expenses?skip=0&limit=20",
            headers=headers,
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {data['total']} total expenses")
            for expense in data['items'][:3]:
                print(f"  - {expense['title']}: ${expense['amount']} ({expense['category']})")
            return True
        else:
            print_error(f"GET /expenses failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"GET /expenses error: {str(e)}")
        return False

def test_create_expense(token):
    """Test POST /expenses endpoint"""
    print_header("10. CREATE EXPENSE")
    try:
        headers = {"Authorization": f"Bearer {token}"}
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
            print(f"Amount: ${expense['amount']}")
            return expense['id']
        else:
            print_error(f"POST /expenses failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"POST /expenses error: {str(e)}")
        return None

def test_database_persistence(token):
    """Test data persistence"""
    print_header("11. DATABASE PERSISTENCE TEST")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a habit
        habit_data = {
            "name": f"Persistence Test {datetime.now().strftime('%H:%M:%S')}",
            "frequency": "daily",
            "description": "Testing data persistence"
        }
        create_response = requests.post(
            f"{BASE_URL}/habits",
            json=habit_data,
            headers=headers,
            timeout=5
        )
        
        if create_response.status_code != 201:
            print_error("Failed to create test habit")
            return False
        
        habit_id = create_response.json()['id']
        print_success(f"Created test habit with ID: {habit_id}")
        
        # Fetch all habits
        fetch_response = requests.get(f"{BASE_URL}/habits", headers=headers, timeout=5)
        if fetch_response.status_code != 200:
            print_error("Failed to fetch habits")
            return False
        
        habits = fetch_response.json()
        found = any(h['id'] == habit_id for h in habits)
        
        if found:
            print_success("✅ Data persisted in database - habit found after creation")
            return True
        else:
            print_error("❌ Data NOT persisted - habit not found after creation")
            return False
            
    except Exception as e:
        print_error(f"Persistence test error: {str(e)}")
        return False

def main():
    """Run all verification tests"""
    print_header("LIFEMIND AI - COMPREHENSIVE VERIFICATION")
    print_info(f"Testing Backend: {BASE_URL}")
    print_info(f"Test User: {TEST_EMAIL}")
    
    results = {}
    
    # Test 1: Health Check
    results['health'] = test_health_check()
    if not results['health']:
        print_error("Backend is not running. Stopping tests.")
        return
    
    # Test 2: Login
    token = test_login()
    results['login'] = token is not None
    if not token:
        print_error("Cannot authenticate. Stopping tests.")
        return
    
    # Test 3-10: API Endpoints
    results['get_habits'] = test_get_habits(token)
    results['create_habit'] = test_create_habit(token) is not None
    results['get_tasks'] = test_get_tasks(token)
    results['create_task'] = test_create_task(token) is not None
    results['get_mood'] = test_get_mood(token)
    results['create_mood'] = test_create_mood(token) is not None
    results['get_expenses'] = test_get_expenses(token)
    results['create_expense'] = test_create_expense(token) is not None
    
    # Test 11: Persistence
    results['persistence'] = test_database_persistence(token)
    
    # Summary
    print_header("VERIFICATION SUMMARY")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test}")
    
    print(f"\n{CYAN}Total: {passed}/{total} tests passed{RESET}")
    
    if passed == total:
        print_success("ALL TESTS PASSED - APPLICATION IS FULLY FUNCTIONAL!")
        return 0
    else:
        print_error(f"SOME TESTS FAILED - {total - passed} issues found")
        return 1

if __name__ == "__main__":
    sys.exit(main())
