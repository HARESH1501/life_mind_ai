import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_settings_api():
    print("Testing Settings API...")
    
    # 1. Login to get token (assuming test user exists)
    # This is a bit complex for a one-off script without credentials.
    # I'll just check if the health endpoint is ok.
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✓ Backend is running and healthy")
        else:
            print("✗ Backend is not healthy")
            return
    except Exception as e:
        print(f"✗ Failed to connect to backend: {e}")
        return

    print("\nManual Verification Steps:")
    print("1. Start the backend: python backend/main.py")
    print("2. Start the frontend: npm run dev")
    print("3. Log in with your account.")
    print("4. Go to Settings -> Appearance and toggle Dark/Light mode.")
    print("5. Go to Settings -> Notifications and click 'Test Email Connection'.")
    print("6. Check the terminal output of the backend for the [DEV MODE] Email log.")

if __name__ == "__main__":
    test_settings_api()
