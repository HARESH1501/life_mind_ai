"""
Migration script to add new columns to user_settings table
Adds: font_size, ui_density, sound_notifications, welcome_email, daily_summary_email, 
      meeting_alert_before, ai_coach_enabled, daily_ai_insights, expense_analysis, 
      productivity_suggestions, wellness_recommendations
"""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "lifemind.db"

def add_columns():
    """Add missing columns to user_settings table"""
    
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}")
        return False
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check which columns already exist
        cursor.execute("PRAGMA table_info(user_settings)")
        existing_columns = {row[1] for row in cursor.fetchall()}
        
        print(f"Existing columns: {existing_columns}")
        
        # Define new columns
        new_columns = [
            ("bio", "VARCHAR"),
            ("profile_picture_url", "VARCHAR"),
            ("accent_color", "VARCHAR DEFAULT 'blue'"),
            ("notifications_enabled", "BOOLEAN DEFAULT 1"),
            ("browser_notifications", "BOOLEAN DEFAULT 1"),
            ("push_notifications", "BOOLEAN DEFAULT 1"),
            ("reminder_time", "VARCHAR DEFAULT '09:00'"),
            ("email_habit_reminders", "BOOLEAN DEFAULT 1"),
            ("email_task_reminders", "BOOLEAN DEFAULT 1"),
            ("email_meeting_reminders", "BOOLEAN DEFAULT 1"),
            ("daily_summary_time", "VARCHAR DEFAULT '08:00'"),
            ("two_factor_enabled", "BOOLEAN DEFAULT 0"),
            ("session_timeout", "INTEGER DEFAULT 30"),
            ("last_login", "DATETIME"),
            ("last_password_change", "DATETIME"),
            ("font_size", "VARCHAR DEFAULT 'medium'"),
            ("ui_density", "VARCHAR DEFAULT 'comfortable'"),
            ("sound_notifications", "BOOLEAN DEFAULT 1"),
            ("welcome_email", "BOOLEAN DEFAULT 1"),
            ("daily_summary_email", "BOOLEAN DEFAULT 1"),
            ("meeting_alert_before", "INTEGER DEFAULT 15"),
            ("ai_coach_enabled", "BOOLEAN DEFAULT 1"),
            ("daily_ai_insights", "BOOLEAN DEFAULT 1"),
            ("expense_analysis", "BOOLEAN DEFAULT 1"),
            ("productivity_suggestions", "BOOLEAN DEFAULT 1"),
            ("wellness_recommendations", "BOOLEAN DEFAULT 1"),
        ]
        
        # Add missing columns
        columns_added = 0
        for col_name, col_type in new_columns:
            if col_name not in existing_columns:
                print(f"Adding column: {col_name}")
                cursor.execute(f"ALTER TABLE user_settings ADD COLUMN {col_name} {col_type}")
                columns_added += 1
            else:
                print(f"Column already exists: {col_name}")
        
        if columns_added > 0:
            conn.commit()
            print(f"\n✓ Successfully added {columns_added} new columns")
        else:
            print("\n✓ All columns already exist")
        
        return True
        
    except sqlite3.OperationalError as e:
        print(f"✗ Database error: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False
    finally:
        conn.close()


if __name__ == "__main__":
    print("Starting migration...")
    success = add_columns()
    if not success:
        print("Migration failed!")
        exit(1)
    print("\nMigration complete!")
