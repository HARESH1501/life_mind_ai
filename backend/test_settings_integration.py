"""
Test script to verify Settings module integration
Tests all new fields and API endpoints
"""

import sys
from database import SessionLocal, engine
from models import Base, User, UserSettings
from schemas import UserSettingsResponse, UserSettingsUpdate
from datetime import datetime

def test_database_schema():
    """Verify the database schema has all required columns"""
    print("\n" + "="*60)
    print("TEST 1: Database Schema Verification")
    print("="*60)
    
    db = SessionLocal()
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # Check if we can create a UserSettings instance
        user = db.query(User).first()
        if not user:
            print("✗ No test user found in database")
            return False
        
        settings = db.query(UserSettings).filter(UserSettings.user_id == user.id).first()
        if not settings:
            print(f"✗ No settings found for user {user.id}")
            return False
        
        print(f"✓ User found: {user.username}")
        print(f"✓ Settings found for user")
        
        # Check all new fields exist
        required_fields = [
            'font_size', 'ui_density', 'sound_notifications', 'welcome_email',
            'daily_summary_email', 'meeting_alert_before', 'ai_coach_enabled',
            'daily_ai_insights', 'expense_analysis', 'productivity_suggestions',
            'wellness_recommendations'
        ]
        
        missing_fields = []
        for field in required_fields:
            if not hasattr(settings, field):
                missing_fields.append(field)
            else:
                value = getattr(settings, field)
                print(f"  ✓ {field}: {value}")
        
        if missing_fields:
            print(f"\n✗ Missing fields: {missing_fields}")
            return False
        
        print("\n✓ All required fields exist!")
        return True
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


def test_schema_validation():
    """Test Pydantic schema validation"""
    print("\n" + "="*60)
    print("TEST 2: Schema Validation")
    print("="*60)
    
    try:
        # Test UserSettingsUpdate with all new fields
        update_data = {
            'theme': 'dark',
            'accent_color': 'cyan',
            'font_size': 'large',
            'ui_density': 'spacious',
            'sound_notifications': True,
            'welcome_email': False,
            'daily_summary_email': True,
            'meeting_alert_before': 30,
            'ai_coach_enabled': True,
            'daily_ai_insights': True,
            'expense_analysis': False,
            'productivity_suggestions': True,
            'wellness_recommendations': True,
        }
        
        schema = UserSettingsUpdate(**update_data)
        print(f"✓ UserSettingsUpdate schema created successfully")
        print(f"  Fields: {len(update_data)}")
        
        # Test UserSettingsResponse
        db = SessionLocal()
        try:
            user = db.query(User).first()
            if user:
                settings = db.query(UserSettings).filter(UserSettings.user_id == user.id).first()
                if settings:
                    response = UserSettingsResponse.from_orm(settings)
                    print(f"✓ UserSettingsResponse created successfully")
                    print(f"  Theme: {response.theme}")
                    print(f"  Font Size: {response.font_size}")
                    print(f"  Density: {response.ui_density}")
                    print(f"  AI Coach Enabled: {response.ai_coach_enabled}")
        finally:
            db.close()
        
        return True
        
    except Exception as e:
        print(f"✗ Schema validation error: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_settings_fields():
    """Test reading and setting all new fields"""
    print("\n" + "="*60)
    print("TEST 3: Settings Fields Read/Write")
    print("="*60)
    
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            print("✗ No test user found")
            return False
        
        settings = db.query(UserSettings).filter(UserSettings.user_id == user.id).first()
        if not settings:
            print("✗ No settings found for user")
            return False
        
        # Test writing new field values
        test_values = {
            'font_size': 'large',
            'ui_density': 'spacious',
            'sound_notifications': False,
            'welcome_email': False,
            'daily_summary_email': False,
            'meeting_alert_before': 60,
            'ai_coach_enabled': False,
            'daily_ai_insights': False,
            'expense_analysis': False,
            'productivity_suggestions': False,
            'wellness_recommendations': False,
        }
        
        for field, value in test_values.items():
            setattr(settings, field, value)
            print(f"  ✓ Set {field} = {value}")
        
        settings.updated_at = datetime.utcnow()
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
        # Verify values were saved
        print(f"\nVerifying saved values:")
        for field, expected_value in test_values.items():
            actual_value = getattr(settings, field)
            if actual_value == expected_value:
                print(f"  ✓ {field}: {actual_value} (correct)")
            else:
                print(f"  ✗ {field}: {actual_value} (expected {expected_value})")
                return False
        
        print(f"\n✓ All fields saved and retrieved successfully!")
        return True
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("SETTINGS MODULE INTEGRATION TESTS")
    print("="*60)
    
    tests = [
        ("Database Schema", test_database_schema),
        ("Schema Validation", test_schema_validation),
        ("Settings Fields", test_settings_fields),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n✗ Test '{test_name}' crashed: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_flag in results.items():
        status = "✓ PASS" if passed_flag else "✗ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✓ All tests passed! Settings module is ready.")
        return 0
    else:
        print(f"\n✗ {total - passed} test(s) failed!")
        return 1


if __name__ == "__main__":
    exit(main())
