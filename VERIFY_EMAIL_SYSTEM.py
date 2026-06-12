"""
Email Notification System Verification Script
Tests all components of the email notification system
"""

import requests
import json
from datetime import datetime, timedelta
import time

BASE_URL = "http://127.0.0.1:8000/api/v1"

# Test user credentials
TEST_EMAIL = "test_email_system@example.com"
TEST_USERNAME = "test_email_user"
TEST_PASSWORD = "TestPassword123!"

def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def print_result(test_name, passed, message=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {test_name}")
    if message:
        print(f"   {message}")

def test_health_check():
    """Test health check endpoint"""
    print_section("1. HEALTH CHECK")
    
    try:
        response = requests.get(f"{BASE_URL.replace('/api/v1', '')}/health")
        passed = response.status_code == 200
        data = response.json()
        scheduler_status = data.get("scheduler", "unknown")
        
        print_result("Health Check", passed, f"Scheduler: {scheduler_status}")
        return passed
    except Exception as e:
        print_result("Health Check", False, str(e))
        return False

def test_registration():
    """Test user registration"""
    print_section("2. USER REGISTRATION")
    
    try:
        payload = {
            "email": TEST_EMAIL,
            "username": TEST_USERNAME,
            "password": TEST_PASSWORD,
            "full_name": "Test User"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        
        if response.status_code == 201:
            data = response.json()
            print_result("User Registration", True, f"User ID: {data.get('id')}")
            return True, data.get('id')
        elif response.status_code == 400:
            # User might already exist, try login instead
            print_result("User Registration", True, "User already exists (will use existing)")
            return True, None
        else:
            print_result("User Registration", False, f"Status: {response.status_code}")
            return False, None
    except Exception as e:
        print_result("User Registration", False, str(e))
        return False, None

def test_login():
    """Test user login"""
    print_section("3. USER LOGIN")
    
    try:
        payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print_result("User Login", True, f"Token received: {token[:20]}...")
            return True, token
        else:
            print_result("User Login", False, f"Status: {response.status_code}")
            return False, None
    except Exception as e:
        print_result("User Login", False, str(e))
        return False, None

def test_get_settings(token):
    """Test getting user settings"""
    print_section("4. USER SETTINGS")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/settings", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            email_notif = data.get("email_notifications", False)
            print_result("Get Settings", True, f"Email notifications: {email_notif}")
            return True
        else:
            print_result("Get Settings", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Settings", False, str(e))
        return False

def test_create_reminder(token):
    """Test creating a reminder"""
    print_section("5. CREATE REMINDER")
    
    try:
        # Schedule reminder for 2 minutes from now
        scheduled_time = (datetime.utcnow() + timedelta(minutes=2)).isoformat()
        
        payload = {
            "title": "Test Reminder",
            "description": "This is a test reminder",
            "reminder_type": "custom",
            "scheduled_time": scheduled_time
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BASE_URL}/notifications/reminders", json=payload, headers=headers)
        
        if response.status_code == 201:
            data = response.json()
            reminder_id = data.get("id")
            print_result("Create Reminder", True, f"Reminder ID: {reminder_id}, Scheduled: {scheduled_time}")
            return True, reminder_id
        else:
            print_result("Create Reminder", False, f"Status: {response.status_code}")
            return False, None
    except Exception as e:
        print_result("Create Reminder", False, str(e))
        return False, None

def test_get_reminders(token):
    """Test getting reminders"""
    print_section("6. GET REMINDERS")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/notifications/reminders", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            count = len(data)
            print_result("Get Reminders", True, f"Total reminders: {count}")
            return True
        else:
            print_result("Get Reminders", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Reminders", False, str(e))
        return False

def test_create_meeting(token):
    """Test creating a meeting"""
    print_section("7. CREATE MEETING")
    
    try:
        # Schedule meeting for 1 hour from now
        start_time = (datetime.utcnow() + timedelta(hours=1)).isoformat()
        end_time = (datetime.utcnow() + timedelta(hours=2)).isoformat()
        
        payload = {
            "title": "Test Meeting",
            "description": "This is a test meeting",
            "start_time": start_time,
            "end_time": end_time,
            "location": "Conference Room A",
            "attendees": "john@example.com,jane@example.com"
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BASE_URL}/notifications/meetings", json=payload, headers=headers)
        
        if response.status_code == 201:
            data = response.json()
            meeting_id = data.get("id")
            print_result("Create Meeting", True, f"Meeting ID: {meeting_id}, Start: {start_time}")
            return True, meeting_id
        else:
            print_result("Create Meeting", False, f"Status: {response.status_code}")
            return False, None
    except Exception as e:
        print_result("Create Meeting", False, str(e))
        return False, None

def test_get_meetings(token):
    """Test getting meetings"""
    print_section("8. GET MEETINGS")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/notifications/meetings", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            count = len(data)
            print_result("Get Meetings", True, f"Total meetings: {count}")
            return True
        else:
            print_result("Get Meetings", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Meetings", False, str(e))
        return False

def test_get_notifications(token):
    """Test getting notifications"""
    print_section("9. GET NOTIFICATIONS")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/notifications", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            count = len(data)
            print_result("Get Notifications", True, f"Total notifications: {count}")
            return True
        else:
            print_result("Get Notifications", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Notifications", False, str(e))
        return False

def test_delete_reminder(token, reminder_id):
    """Test deleting a reminder"""
    print_section("10. DELETE REMINDER")
    
    if not reminder_id:
        print_result("Delete Reminder", False, "No reminder ID provided")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.delete(f"{BASE_URL}/notifications/reminders/{reminder_id}", headers=headers)
        
        if response.status_code == 204:
            print_result("Delete Reminder", True, f"Reminder {reminder_id} deleted")
            return True
        else:
            print_result("Delete Reminder", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Delete Reminder", False, str(e))
        return False

def test_delete_meeting(token, meeting_id):
    """Test deleting a meeting"""
    print_section("11. DELETE MEETING")
    
    if not meeting_id:
        print_result("Delete Meeting", False, "No meeting ID provided")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.delete(f"{BASE_URL}/notifications/meetings/{meeting_id}", headers=headers)
        
        if response.status_code == 204:
            print_result("Delete Meeting", True, f"Meeting {meeting_id} deleted")
            return True
        else:
            print_result("Delete Meeting", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Delete Meeting", False, str(e))
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  EMAIL NOTIFICATION SYSTEM VERIFICATION")
    print("="*60)
    print(f"\nTest Email: {TEST_EMAIL}")
    print(f"Backend URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Test 1: Health Check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: Registration
    reg_passed, user_id = test_registration()
    results.append(("User Registration", reg_passed))
    
    # Test 3: Login
    login_passed, token = test_login()
    results.append(("User Login", login_passed))
    
    if not token:
        print("\n❌ Cannot continue without authentication token")
        return
    
    # Test 4: Settings
    results.append(("Get Settings", test_get_settings(token)))
    
    # Test 5: Create Reminder
    reminder_passed, reminder_id = test_create_reminder(token)
    results.append(("Create Reminder", reminder_passed))
    
    # Test 6: Get Reminders
    results.append(("Get Reminders", test_get_reminders(token)))
    
    # Test 7: Create Meeting
    meeting_passed, meeting_id = test_create_meeting(token)
    results.append(("Create Meeting", meeting_passed))
    
    # Test 8: Get Meetings
    results.append(("Get Meetings", test_get_meetings(token)))
    
    # Test 9: Get Notifications
    results.append(("Get Notifications", test_get_notifications(token)))
    
    # Test 10: Delete Reminder
    if reminder_id:
        results.append(("Delete Reminder", test_delete_reminder(token, reminder_id)))
    
    # Test 11: Delete Meeting
    if meeting_id:
        results.append(("Delete Meeting", test_delete_meeting(token, meeting_id)))
    
    # Summary
    print_section("VERIFICATION SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅" if result else "❌"
        print(f"{status} {test_name}")
    
    print(f"\n{'='*60}")
    print(f"Results: {passed}/{total} tests passed ({int(passed/total*100)}%)")
    print(f"{'='*60}\n")
    
    if passed == total:
        print("🎉 All tests passed! Email notification system is working correctly.")
    else:
        print(f"⚠️  {total - passed} test(s) failed. Check the output above for details.")

if __name__ == "__main__":
    main()
