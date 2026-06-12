import sqlite3
import os

db_path = r'd:\LifeMind-AI\backend\lifemind.db'

print("=" * 80)
print("DATABASE SCHEMA VERIFICATION")
print("=" * 80)

if not os.path.exists(db_path):
    print(f"❌ Database file not found at: {db_path}")
    exit(1)

print(f"✅ Database found at: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all tables
print("\n" + "=" * 80)
print("ALL TABLES IN DATABASE")
print("=" * 80)

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

for table in tables:
    print(f"  ✅ {table[0]}")

# Check expenses table schema
print("\n" + "=" * 80)
print("EXPENSES TABLE SCHEMA")
print("=" * 80)

try:
    cursor.execute("PRAGMA table_info(expenses)")
    columns = cursor.fetchall()
    
    if columns:
        print("\nColumns in expenses table:")
        for col in columns:
            col_id, col_name, col_type, not_null, default, pk = col
            print(f"  - {col_name} ({col_type}) {'NOT NULL' if not_null else 'NULLABLE'} {'PRIMARY KEY' if pk else ''}")
    else:
        print("❌ Expenses table does not exist!")
except Exception as e:
    print(f"❌ Error: {e}")

# Check if user_id column exists
print("\n" + "=" * 80)
print("CHECKING FOR user_id COLUMN")
print("=" * 80)

try:
    cursor.execute("PRAGMA table_info(expenses)")
    columns = cursor.fetchall()
    col_names = [col[1] for col in columns]
    
    if 'user_id' in col_names:
        print("✅ user_id column EXISTS")
    else:
        print("❌ user_id column MISSING!")
        print(f"   Available columns: {col_names}")
except Exception as e:
    print(f"❌ Error: {e}")

# Check habits table schema
print("\n" + "=" * 80)
print("HABITS TABLE SCHEMA")
print("=" * 80)

try:
    cursor.execute("PRAGMA table_info(habits)")
    columns = cursor.fetchall()
    
    if columns:
        print("\nColumns in habits table:")
        for col in columns:
            col_id, col_name, col_type, not_null, default, pk = col
            print(f"  - {col_name} ({col_type})")
    else:
        print("❌ Habits table does not exist!")
except Exception as e:
    print(f"❌ Error: {e}")

# Check tasks table schema
print("\n" + "=" * 80)
print("TASKS TABLE SCHEMA")
print("=" * 80)

try:
    cursor.execute("PRAGMA table_info(tasks)")
    columns = cursor.fetchall()
    
    if columns:
        print("\nColumns in tasks table:")
        for col in columns:
            col_id, col_name, col_type, not_null, default, pk = col
            print(f"  - {col_name} ({col_type})")
    else:
        print("❌ Tasks table does not exist!")
except Exception as e:
    print(f"❌ Error: {e}")

# Check users table
print("\n" + "=" * 80)
print("USERS TABLE SCHEMA")
print("=" * 80)

try:
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    
    if columns:
        print("\nColumns in users table:")
        for col in columns:
            col_id, col_name, col_type, not_null, default, pk = col
            print(f"  - {col_name} ({col_type})")
    else:
        print("❌ Users table does not exist!")
except Exception as e:
    print(f"❌ Error: {e}")

# Count records in each table
print("\n" + "=" * 80)
print("RECORD COUNTS")
print("=" * 80)

for table in ['users', 'expenses', 'habits', 'tasks', 'mood_entries']:
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"  {table}: {count} records")
    except Exception as e:
        print(f"  {table}: Error - {e}")

conn.close()

print("\n" + "=" * 80)
print("DATABASE CHECK COMPLETE")
print("=" * 80)
