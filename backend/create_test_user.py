#!/usr/bin/env python
"""
Create a test user for development
"""

import sys
sys.path.insert(0, '.')

from database import SessionLocal, engine, Base
from models import User
from auth import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

# Create session
db = SessionLocal()

try:
    # Check if test user exists
    existing = db.query(User).filter(User.email == 'test@example.com').first()
    if not existing:
        # Use a shorter password to avoid bcrypt issues
        test_user = User(
            email='test@example.com',
            username='testuser',
            full_name='Test User',
            hashed_password=hash_password('test123'),  # Shorter password
            is_active=True
        )
        db.add(test_user)
        db.commit()
        print('✓ Test user created: test@example.com / test123')
    else:
        print('✓ Test user already exists: test@example.com')
finally:
    db.close()
