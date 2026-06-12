"""
Complete Settings Feature Verification Script
Tests all functionality: Theme, Colors, Email, Notifications, Profile, Security, Data
"""

import requests
import json
import time
from typing import Dict, Any, Tuple
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"
NEW_PASSWORD = "NewPassword123"

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


class SettingsFeatureVerifier:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.headers = {}
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "total": 0,
            "tests": []
        }
        
    def print_header(self, text: str):
        """Print colored header"""
        print(f"\n{bcolors.HEADER}{bcolors.BOLD}{'='*70}{bcolors.ENDC}")
        print(f"{bcolors.HEADER}{bcolors.BOLD}{text.center(70)}{bcolors.ENDC}")
        print(f"{bcolors.HEADER}{bcolors.BOLD}{'='*70}{bcolors.ENDC}\n")
    
    def print_test(self, name: str, status: bool, message: str = ""):
        """Print test result"""
        self.test_results["total"] += 1
        if status:
            self.test_results["passed"] += 1
            icon = "✅"
            color = bcolors.OKGREEN
            status_text = "PASS"
        else:
            self.test_results["failed"] += 1
            icon = "❌"
            color = bcolors.FAIL
            status_text = "FAIL"
        
        self.test_results["tests"].append({
            "name": name,
            "status": status_text,
            "message": message
        })
        
        print(f"{icon} {color}{status_text}{bcolors.ENDC} - {name}")
        if message:
            print(f"   {bcolors.OKCYAN}→ {message}{bcolors.ENDC}")
    
    def login(self) -> bool:
        """Login and get token"""
        self.print_header("🔐 AUTHENTICATION TEST")
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.headers = {"Authorization": f"Bearer {self.token}"}
                self.print_test("Login", True, f"Token received: {self.token[:20]}...")
                return True
            else:
                self.print_test("Login", False, f"Status {response.status_code}: {response.text[:100]}")
                return False
        except Exception as e:
            self.print_test("Login", False, f"Error: {str(e)}")
            return False
    
    def test_profile_operations(self):
        """Test profile GET and PUT"""
        self.print_header("👤 PROFILE MANAGEMENT TESTS")
        
        # Test 1: Get Profile
        try:
            response = requests.get(f"{self.base_url}/settings/profile", headers=self.headers, timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.print_test("Get Profile", True, f"Email: {data.get('email')}, Name: {data.get('full_name')}")
            else:
                self.print_test("Get Profile", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Get Profile", False, str(e))
        
        # Test 2: Update Profile
        try:
            test_name = f"Test User {datetime.now().strftime('%H:%M:%S')}"
            response = requests.put(
                f"{self.base_url}/settings/profile",
                headers=self.headers,
                json={"full_name": test_name, "bio": "Automated test bio"},
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.print_test("Update Profile", True, f"New name: {data.get('full_name')}")
            else:
                self.print_test("Update Profile", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Update Profile", False, str(e))
    
    def test_settings_operations(self):
        """Test settings GET and PUT"""
        self.print_header("⚙️ GENERAL SETTINGS TESTS")
        
        # Test 1: Get All Settings
        try:
            response = requests.get(f"{self.base_url}/settings", headers=self.headers, timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.print_test("Get All Settings", True, 
                    f"Theme: {data.get('theme')}, Notifications: {data.get('notifications_enabled')}")
            else:
                self.print_test("Get All Settings", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Get All Settings", False, str(e))
        
        # Test 2: Update Settings
        try:
            response = requests.put(
                f"{self.base_url}/settings",
                headers=self.headers,
                json={
                    "theme": "dark",
                    "accent_color": "purple",
                    "notifications_enabled": True,
                    "email_notifications": True,
                    "meeting_alert_before": 15,
                    "session_timeout": 60
                },
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.print_test("Update Settings", True, 
                    f"Theme: {data.get('theme')}, Accent: {data.get('accent_color')}")
            else:
                self.print_test("Update Settings", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Update Settings", False, str(e))
    
    def test_appearance_settings(self):
        """Test appearance settings"""
        self.print_header("🎨 APPEARANCE TESTS")
        
        # Test: Update Appearance
        try:
            for theme in ["light", "dark", "system"]:
                response = requests.put(
                    f"{self.base_url}/settings/appearance",
                    headers=self.headers,
                    json={"theme": theme, "accent_color": "cyan"},
                    timeout=5
                )
                if response.status_code == 200:
                    self.print_test(f"Set Theme to '{theme}'", True, "Theme applied successfully")
                else:
                    self.print_test(f"Set Theme to '{theme}'", False, f"Status {response.status_code}")
                time.sleep(0.5)
        except Exception as e:
            self.print_test("Appearance Settings", False, str(e))
    
    def test_notification_settings(self):
        """Test notification settings"""
        self.print_header("🔔 NOTIFICATION TESTS")
        
        try:
            response = requests.put(
                f"{self.base_url}/settings/notifications",
                headers=self.headers,
                json={
                    "notifications_enabled": True,
                    "habit_reminders": True,
                    "task_reminders": True,
                    "meeting_reminders": True,
                    "browser_notifications": True
                },
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.print_test("Update Notifications", True, 
                    f"Enabled: {data.get('notifications_enabled')}, Habits: {data.get('habit_reminders')}")
            else:
                self.print_test("Update Notifications", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Update Notifications", False, str(e))
    
    def test_email_preferences(self):
        """Test email preferences"""
        self.print_header("📧 EMAIL PREFERENCES TESTS")
        
        # Test 1: Update Email Preferences
        try:
            response = requests.put(
                f"{self.base_url}/settings/email-preferences",
                headers=self.headers,
                json={
                    "email_habit_reminders": True,
                    "email_task_reminders": True,
                    "daily_summary_email": True,
                    "welcome_email": True
                },
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.print_test("Update Email Preferences", True, 
                    f"Welcome: {data.get('welcome_email')}, Summary: {data.get('daily_summary_email')}")
            else:
                self.print_test("Update Email Preferences", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Update Email Preferences", False, str(e))
        
        # Test 2: Send Test Email
        try:
            print(f"\n{bcolors.WARNING}⏳ Sending test email (this may take 5-10 seconds)...{bcolors.ENDC}")
            response = requests.post(
                f"{self.base_url}/settings/test-email",
                headers=self.headers,
                timeout=15
            )
            if response.status_code == 200:
                self.print_test("Send Test Email", True, 
                    "Email sent! Check your inbox at: " + TEST_EMAIL)
            else:
                self.print_test("Send Test Email", False, 
                    f"Status {response.status_code} - Check SMTP config in backend/.env")
        except Exception as e:
            self.print_test("Send Test Email", False, 
                f"Error: {str(e)} - Check SMTP configuration")
    
    def test_security_settings(self):
        """Test security settings"""
        self.print_header("🔒 SECURITY TESTS")
        
        # Test 1: Update Security Settings
        try:
            response = requests.put(
                f"{self.base_url}/settings/security",
                headers=self.headers,
                json={
                    "two_factor_enabled": False,
                    "session_timeout": 30
                },
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.print_test("Update Security Settings", True, 
                    f"2FA: {data.get('two_factor_enabled')}, Timeout: {data.get('session_timeout')}min")
            else:
                self.print_test("Update Security Settings", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Update Security Settings", False, str(e))
        
        # Test 2: Logout All Devices
        try:
            response = requests.post(
                f"{self.base_url}/settings/logout-all-devices",
                headers=self.headers,
                timeout=5
            )
            if response.status_code == 200:
                self.print_test("Logout All Devices", True, "All sessions logged out")
            else:
                self.print_test("Logout All Devices", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Logout All Devices", False, str(e))
    
    def test_data_management(self):
        """Test data management"""
        self.print_header("💾 DATA MANAGEMENT TESTS")
        
        # Test: Export Data
        try:
            response = requests.post(
                f"{self.base_url}/settings/export-data",
                headers=self.headers,
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.print_test("Export Data", True, f"Status: {data.get('status')}")
            else:
                self.print_test("Export Data", False, f"Status {response.status_code}")
        except Exception as e:
            self.print_test("Export Data", False, str(e))
    
    def test_backend_availability(self):
        """Test if backend is running"""
        self.print_header("🚀 BACKEND AVAILABILITY CHECK")
        
        try:
            response = requests.get(f"{self.base_url}/docs", timeout=3)
            if response.status_code == 200:
                self.print_test("Backend Server", True, "Server is running on http://localhost:8000")
            else:
                self.print_test("Backend Server", False, f"Unexpected status: {response.status_code}")
        except requests.exceptions.ConnectionError:
            self.print_test("Backend Server", False, 
                "Cannot connect to backend. Start it with: uvicorn main:app --reload --port 8000")
            return False
        except Exception as e:
            self.print_test("Backend Server", False, str(e))
            return False
        
        return True
    
    def print_summary(self):
        """Print test summary"""
        self.print_header("📊 TEST SUMMARY")
        
        total = self.test_results["total"]
        passed = self.test_results["passed"]
        failed = self.test_results["failed"]
        percentage = (passed / total * 100) if total > 0 else 0
        
        print(f"\n{bcolors.BOLD}Total Tests:{bcolors.ENDC} {total}")
        print(f"{bcolors.OKGREEN}✅ Passed:{bcolors.ENDC} {passed}")
        print(f"{bcolors.FAIL}❌ Failed:{bcolors.ENDC} {failed}")
        print(f"{bcolors.OKCYAN}Success Rate:{bcolors.ENDC} {percentage:.1f}%\n")
        
        if failed > 0:
            print(f"{bcolors.WARNING}⚠️  Failed Tests:{bcolors.ENDC}")
            for test in self.test_results["tests"]:
                if test["status"] == "FAIL":
                    print(f"   • {test['name']}: {test['message']}")
        
        print(f"\n{'='*70}\n")
        
        if percentage == 100:
            print(f"{bcolors.OKGREEN}{bcolors.BOLD}🎉 ALL TESTS PASSED! Settings feature is working perfectly!{bcolors.ENDC}\n")
        elif percentage >= 80:
            print(f"{bcolors.WARNING}{bcolors.BOLD}⚠️  Most tests passed, but some features need attention.{bcolors.ENDC}\n")
        else:
            print(f"{bcolors.FAIL}{bcolors.BOLD}❌ Multiple features failing. Check backend configuration and logs.{bcolors.ENDC}\n")
    
    def run_all_tests(self):
        """Run all tests"""
        print(f"\n{bcolors.OKBLUE}{bcolors.BOLD}")
        print("╔══════════════════════════════════════════════════════════════════╗")
        print("║           LIFEMIND AI - COMPLETE SETTINGS VERIFICATION          ║")
        print("║                    All Features Test Suite                      ║")
        print("╚══════════════════════════════════════════════════════════════════╝")
        print(f"{bcolors.ENDC}\n")
        
        # Check backend availability
        if not self.test_backend_availability():
            print(f"\n{bcolors.FAIL}Cannot proceed without backend running.{bcolors.ENDC}")
            print(f"{bcolors.WARNING}Start backend with:{bcolors.ENDC}")
            print("  cd d:\\LifeMind-AI\\backend")
            print("  .\\venv\\Scripts\\Activate.ps1")
            print("  uvicorn main:app --reload --port 8000\n")
            return
        
        # Login
        if not self.login():
            print(f"\n{bcolors.FAIL}Cannot proceed without authentication.{bcolors.ENDC}\n")
            return
        
        # Run all test suites
        self.test_profile_operations()
        self.test_settings_operations()
        self.test_appearance_settings()
        self.test_notification_settings()
        self.test_email_preferences()
        self.test_security_settings()
        self.test_data_management()
        
        # Print summary
        self.print_summary()


def main():
    """Main execution"""
    verifier = SettingsFeatureVerifier()
    verifier.run_all_tests()


if __name__ == "__main__":
    main()
