#!/usr/bin/env python
"""Final verification that all systems are working"""

import requests
import json
from datetime import datetime

BASE_URL = 'http://localhost:8000/api/v1'
TEST_EMAIL = 'test@example.com'
TEST_PASSWORD = 'test123'

print('='*60)
print('FINAL VERIFICATION - ALL SYSTEMS CHECK')
print('='*60)

# 1. Health Check
try:
    response = requests.get('http://localhost:8000/health', timeout=5)
    print('✅ Backend Health: OK')
except:
    print('❌ Backend Health: FAILED')
    exit(1)

# 2. Login
try:
    response = requests.post(
        f'{BASE_URL}/auth/login',
        json={'email': TEST_EMAIL, 'password': TEST_PASSWORD},
        timeout=5
    )
    if response.status_code == 200:
        token = response.json()['access_token']
        print('✅ Authentication: OK')
    else:
        print('❌ Authentication: FAILED')
        exit(1)
except Exception as e:
    print(f'❌ Authentication: {e}')
    exit(1)

# 3. Protected Endpoints
headers = {'Authorization': f'Bearer {token}'}
endpoints = [
    ('GET', '/habits'),
    ('GET', '/tasks'),
    ('GET', '/mood'),
    ('GET', '/expenses?skip=0&limit=20'),
]

all_ok = True
for method, endpoint in endpoints:
    try:
        if method == 'GET':
            response = requests.get(f'{BASE_URL}{endpoint}', headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            print(f'✅ {method} {endpoint}: OK')
        else:
            print(f'❌ {method} {endpoint}: {response.status_code}')
            all_ok = False
    except Exception as e:
        print(f'❌ {method} {endpoint}: {e}')
        all_ok = False

# 4. Create Habit
try:
    habit_data = {
        'name': f'Verification Test {datetime.now().strftime("%H:%M:%S")}',
        'frequency': 'daily',
        'description': 'Final verification test'
    }
    response = requests.post(
        f'{BASE_URL}/habits',
        json=habit_data,
        headers=headers,
        timeout=5
    )
    if response.status_code == 201:
        habit = response.json()
        print(f'✅ Create Habit: OK (ID: {habit["id"]})')
    else:
        print(f'❌ Create Habit: {response.status_code}')
        all_ok = False
except Exception as e:
    print(f'❌ Create Habit: {e}')
    all_ok = False

# 5. Fetch Habits
try:
    response = requests.get(f'{BASE_URL}/habits', headers=headers, timeout=5)
    if response.status_code == 200:
        habits = response.json()
        print(f'✅ Fetch Habits: OK ({len(habits)} habits)')
    else:
        print(f'❌ Fetch Habits: {response.status_code}')
        all_ok = False
except Exception as e:
    print(f'❌ Fetch Habits: {e}')
    all_ok = False

print('='*60)
if all_ok:
    print('🎉 ALL SYSTEMS OPERATIONAL - APPLICATION READY')
else:
    print('⚠️  SOME SYSTEMS FAILED - CHECK LOGS')
print('='*60)
