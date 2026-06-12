"""
Settings API Endpoint Testing Script
Tests all settings-related endpoints to verify functionality
"""

import requests
import json
from typing import Optional

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"

class SettingsAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token: Optional[str] = None
        self.headers = {}
        
    def login(self, email: str, password: str) -> bool:
        """Login and get authentication token"""
        print("\n🔐 Testing Login...")
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"email": email, "password": password}
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.headers = {"Authorization": f"Bearer {self.token}"}
                print(f"✅ Login successful - Token: {self.token[:20]}...")
                return True
            else:
                print(f"❌ Login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False
    
    def test_get_profile(self):
        """Test GET /settings/profile"""
        print("\n📋 Testing GET /settings/profile...")
        try:
            response = requests.get(
                f"{self.base_url}/settings/profile",
                headers=self.headers
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Profile retrieved:")
                print(f"   - Email: {data.get('email')}")
                print(f"   - Username: {data.get('username')}")
                print(f"   - Full Name: {data.get('full_name')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_update_profile(self):
        """Test PUT /settings/profile"""
        print("\n✏️ Testing PUT /settings/profile...")
        try:
            response = requests.put(
                f"{self.base_url}/settings/profile",
                headers=self.headers,
                json={
                    "full_name": "Test User Updated",
                    "bio": "This is my updated bio for testing"
                }
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Profile updated:")
                print(f"   - Full Name: {data.get('full_name')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_get_settings(self):
        """Test GET /settings"""
        print("\n⚙️ Testing GET /settings...")
        try:
            response = requests.get(
                f"{self.base_url}/settings",
                headers=self.headers
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Settings retrieved:")
                print(f"   - Theme: {data.get('theme')}")
                print(f"   - Accent Color: {data.get('accent_color')}")
                print(f"   - Notifications Enabled: {data.get('notifications_enabled')}")
                print(f"   - Email Notifications: {data.get('email_notifications')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_update_settings(self):
        """Test PUT /settings"""
        print("\n🔧 Testing PUT /settings...")
        try:
            response = requests.put(
                f"{self.base_url}/settings",
                headers=self.headers,
                json={
                    "theme": "dark",
                    "accent_color": "purple",
                    "notifications_enabled": True,
                    "email_notifications": True,
                    "habit_reminders": True,
                    "task_reminders": True,
                    "meeting_alert_before": 15,
                    "session_timeout": 30,
                    "welcome_email": True,
                    "daily_summary_email": True
                }
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Settings updated:")
                print(f"   - Theme: {data.get('theme')}")
                print(f"   - Accent Color: {data.get('accent_color')}")
                print(f"   - Meeting Alert Before: {data.get('meeting_alert_before')} minutes")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_update_appearance(self):
        """Test PUT /settings/appearance"""
        print("\n🎨 Testing PUT /settings/appearance...")
        try:
            response = requests.put(
                f"{self.base_url}/settings/appearance",
                headers=self.headers,
                json={
                    "theme": "dark",
                    "accent_color": "cyan"
                }
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Appearance updated:")
                print(f"   - Theme: {data.get('theme')}")
                print(f"   - Accent Color: {data.get('accent_color')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_update_notifications(self):
        """Test PUT /settings/notifications"""
        print("\n🔔 Testing PUT /settings/notifications...")
        try:
            response = requests.put(
                f"{self.base_url}/settings/notifications",
                headers=self.headers,
                json={
                    "notifications_enabled": True,
                    "habit_reminders": True,
                    "task_reminders": True,
                    "meeting_reminders": True,
                    "browser_notifications": True,
                    "sound_notifications": False
                }
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Notifications updated:")
                print(f"   - Enabled: {data.get('notifications_enabled')}")
                print(f"   - Habit Reminders: {data.get('habit_reminders')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_update_email_preferences(self):
        """Test PUT /settings/email-preferences"""
        print("\n📧 Testing PUT /settings/email-preferences...")
        try:
            response = requests.put(
                f"{self.base_url}/settings/email-preferences",
                headers=self.headers,
                json={
                    "email_habit_reminders": True,
                    "email_task_reminders": True,
                    "email_meeting_reminders": True,
                    "daily_summary": True,
                    "daily_summary_email": True,
                    "welcome_email": True,
                    "daily_summary_time": "09:00"
                }
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Email preferences updated:")
                print(f"   - Daily Summary Email: {data.get('daily_summary_email')}")
                print(f"   - Welcome Email: {data.get('welcome_email')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_send_test_email(self):
        """Test POST /settings/test-email"""
        print("\n📨 Testing POST /settings/test-email...")
        try:
            response = requests.post(
                f"{self.base_url}/settings/test-email",
                headers=self.headers
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Test email sent:")
                print(f"   - Status: {data.get('status')}")
                print(f"   - Message: {data.get('message')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_update_security(self):
        """Test PUT /settings/security"""
        print("\n🔒 Testing PUT /settings/security...")
        try:
            response = requests.put(
                f"{self.base_url}/settings/security",
                headers=self.headers,
                json={
                    "two_factor_enabled": False,
                    "session_timeout": 60
                }
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Security settings updated:")
                print(f"   - Two-Factor: {data.get('two_factor_enabled')}")
                print(f"   - Session Timeout: {data.get('session_timeout')} minutes")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_logout_all_devices(self):
        """Test POST /settings/logout-all-devices"""
        print("\n🚪 Testing POST /settings/logout-all-devices...")
        try:
            response = requests.post(
                f"{self.base_url}/settings/logout-all-devices",
                headers=self.headers
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Logout all devices successful:")
                print(f"   - Status: {data.get('status')}")
                print(f"   - Message: {data.get('message')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def test_export_data(self):
        """Test POST /settings/export-data"""
        print("\n💾 Testing POST /settings/export-data...")
        try:
            response = requests.post(
                f"{self.base_url}/settings/export-data",
                headers=self.headers
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Data export initiated:")
                print(f"   - Status: {data.get('status')}")
                print(f"   - Message: {data.get('message')}")
                return True
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all settings endpoint tests"""
        print("=" * 60)
        print("🧪 SETTINGS API ENDPOINT TESTING")
        print("=" * 60)
        
        # Login first
        if not self.login(TEST_EMAIL, TEST_PASSWORD):
            print("\n❌ Cannot proceed without authentication")
            return
        
        # Track results
        results = {}
        
        # Run all tests
        results["GET Profile"] = self.test_get_profile()
        results["PUT Profile"] = self.test_update_profile()
        results["GET Settings"] = self.test_get_settings()
        results["PUT Settings"] = self.test_update_settings()
        results["PUT Appearance"] = self.test_update_appearance()
        results["PUT Notifications"] = self.test_update_notifications()
        results["PUT Email Preferences"] = self.test_update_email_preferences()
        results["POST Test Email"] = self.test_send_test_email()
        results["PUT Security"] = self.test_update_security()
        results["POST Logout All Devices"] = self.test_logout_all_devices()
        results["POST Export Data"] = self.test_export_data()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} - {test_name}")
        
        print("\n" + "=" * 60)
        print(f"Total: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
        print("=" * 60)
        
        if passed == total:
            print("\n🎉 All tests passed! Settings API is fully functional.")
        else:
            print(f"\n⚠️ {total - passed} test(s) failed. Please review the errors above.")


def main():
    """Main test execution"""
    tester = SettingsAPITester()
    tester.run_all_tests()


if __name__ == "__main__":
    main()
