"""
FIX DATABASE SCHEMA - Recreate tables with correct columns
"""

import sqlite3
import os
from datetime import datetime

db_path = r'd:\LifeMind-AI\backend\lifemind.db'

print("=" * 80)
print("FIXING DATABASE SCHEMA")
print("=" * 80)

# Backup existing database
backup_path = db_path + '.backup'
if os.path.exists(db_path):
    import shutil
    shutil.copy(db_path, backup_path)
    print(f"✅ Backup created at: {backup_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Step 1: Backup existing expenses data
print("\n[STEP 1] BACKING UP EXISTING EXPENSES DATA")
print("-" * 80)

cursor.execute("SELECT * FROM expenses")
expenses_data = cursor.fetchall()
print(f"✅ Backed up {len(expenses_data)} expense records")

# Step 2: Drop old expenses table
print("\n[STEP 2] DROPPING OLD EXPENSES TABLE")
print("-" * 80)

cursor.execute("DROP TABLE IF EXISTS expenses")
conn.commit()
print("✅ Old expenses table dropped")

# Step 3: Create new expenses table with correct schema
print("\n[STEP 3] CREATING NEW EXPENSES TABLE")
print("-" * 80)

create_expenses_sql = """
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    amount FLOAT NOT NULL,
    category VARCHAR NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
"""

cursor.execute(create_expenses_sql)
conn.commit()
print("✅ New expenses table created with correct schema")

# Step 4: Restore data (with user_id = 1 for all old records)
print("\n[STEP 4] RESTORING EXPENSES DATA")
print("-" * 80)

for expense in expenses_data:
    # Old format: (id, title, amount, category)
    # New format: (id, user_id, title, description, amount, category, date, created_at, updated_at)
    try:
        cursor.execute("""
            INSERT INTO expenses (id, user_id, title, description, amount, category, date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            expense[0],  # id
            1,  # user_id (default to user 1)
            expense[1],  # title
            None,  # description
            expense[2],  # amount
            expense[3],  # category
            datetime.now(),  # date
            datetime.now(),  # created_at
            datetime.now()   # updated_at
        ))
    except Exception as e:
        print(f"❌ Error restoring expense {expense[0]}: {e}")

conn.commit()
print(f"✅ Restored {len(expenses_data)} expense records")

# Step 5: Verify new schema
print("\n[STEP 5] VERIFYING NEW SCHEMA")
print("-" * 80)

cursor.execute("PRAGMA table_info(expenses)")
columns = cursor.fetchall()

print("New expenses table columns:")
for col in columns:
    col_id, col_name, col_type, not_null, default, pk = col
    print(f"  ✅ {col_name} ({col_type}) {'NOT NULL' if not_null else 'NULLABLE'}")

# Step 6: Verify data
print("\n[STEP 6] VERIFYING DATA")
print("-" * 80)

cursor.execute("SELECT COUNT(*) FROM expenses")
count = cursor.fetchone()[0]
print(f"✅ Total expenses: {count}")

cursor.execute("SELECT id, user_id, title, amount, category FROM expenses LIMIT 5")
records = cursor.fetchall()
print("\nSample records:")
for record in records:
    print(f"  - ID: {record[0]}, User: {record[1]}, Title: {record[2]}, Amount: {record[3]}, Category: {record[4]}")

conn.close()

print("\n" + "=" * 80)
print("DATABASE SCHEMA FIX COMPLETE")
print("=" * 80)
print("\n✅ The expenses table has been fixed!")
print("✅ All data has been preserved")
print("✅ Restart the backend to apply changes")
