# Production Deployment Guide - LifeMind AI SaaS Platform

## Overview
This guide covers deploying LifeMind AI as a production-grade SaaS application with all new features (Settings, Notifications, Meetings).

---

## Architecture Overview

### Frontend Stack
- **Framework**: React 18 + Vite
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: CSS3 + Dark Mode Support
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: SQLAlchemy
- **Authentication**: JWT + Argon2
- **Task Scheduling**: APScheduler (for reminders)
- **Email**: FastAPI-Mail

### Infrastructure
- **Web Server**: Nginx (reverse proxy)
- **Application Server**: Uvicorn (ASGI)
- **Database**: PostgreSQL 14+
- **Cache**: Redis (optional, for sessions)
- **Monitoring**: Prometheus + Grafana (optional)

---

## Pre-Deployment Checklist

### Backend
- [ ] Update `config.py` with production settings
- [ ] Set environment variables for secrets
- [ ] Configure PostgreSQL database
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up logging and monitoring
- [ ] Configure database backups
- [ ] Test all API endpoints
- [ ] Set up rate limiting
- [ ] Configure CSRF protection

### Frontend
- [ ] Update `VITE_API_URL` to production backend
- [ ] Build optimized production bundle
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics
- [ ] Test dark mode across browsers
- [ ] Verify responsive design
- [ ] Test all features end-to-end
- [ ] Set up performance monitoring

---

## Backend Deployment

### 1. Environment Configuration

Create `.env` file in backend directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lifemind_prod
SQLALCHEMY_ECHO=false

# Security
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SENDER_EMAIL=noreply@yourdomain.com

# Application
PROJECT_NAME=LifeMind AI
PROJECT_VERSION=1.0.0
DEBUG=false
LOG_LEVEL=info

# APScheduler (for reminders)
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE=UTC
```

### 2. Database Setup

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE lifemind_prod;
CREATE USER lifemind_user WITH PASSWORD 'secure_password';
ALTER ROLE lifemind_user SET client_encoding TO 'utf8';
ALTER ROLE lifemind_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lifemind_user SET default_transaction_deferrable TO on;
ALTER ROLE lifemind_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE lifemind_prod TO lifemind_user;
\q

# Run migrations (if using Alembic)
alembic upgrade head

# Or create tables directly
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
pip install gunicorn  # Production ASGI server
pip install psycopg2-binary  # PostgreSQL adapter
pip install python-dotenv  # Environment variables
```

### 4. Update requirements.txt

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-jose==3.3.0
passlib==1.7.4
argon2-cffi==23.1.0
python-multipart==0.0.6
python-dotenv==1.0.0
psycopg2-binary==2.9.9
fastapi-mail==1.4.1
apscheduler==3.10.4
gunicorn==21.2.0
```

### 5. Create Systemd Service

Create `/etc/systemd/system/lifemind-api.service`:

```ini
[Unit]
Description=LifeMind AI API
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/lifemind/backend
Environment="PATH=/var/www/lifemind/venv/bin"
ExecStart=/var/www/lifemind/venv/bin/gunicorn \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /var/log/lifemind/access.log \
    --error-logfile /var/log/lifemind/error.log \
    main:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable lifemind-api
sudo systemctl start lifemind-api
sudo systemctl status lifemind-api
```

### 6. Configure Nginx

Create `/etc/nginx/sites-available/lifemind`:

```nginx
upstream lifemind_api {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;

    # API Proxy
    location /api/ {
        proxy_pass http://lifemind_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Frontend
    location / {
        root /var/www/lifemind/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Static Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/lifemind/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/lifemind /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Set Up SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Frontend Deployment

### 1. Build Production Bundle

```bash
cd frontend
npm install
npm run build
```

### 2. Configure Environment

Create `.env.production`:

```
VITE_API_URL=https://yourdomain.com/api/v1
VITE_APP_NAME=LifeMind AI
VITE_ENABLE_ANALYTICS=true
```

### 3. Deploy to Server

```bash
# Copy built files to server
scp -r dist/* user@yourdomain.com:/var/www/lifemind/frontend/dist/

# Or use rsync
rsync -avz dist/ user@yourdomain.com:/var/www/lifemind/frontend/dist/
```

### 4. Configure CDN (Optional)

Use CloudFlare or AWS CloudFront for:
- Static asset caching
- DDoS protection
- Global distribution
- Automatic HTTPS

---

## Database Backup Strategy

### Automated Backups

Create `/usr/local/bin/backup-lifemind.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/lifemind"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="lifemind_prod"
DB_USER="lifemind_user"

mkdir -p $BACKUP_DIR

# Full backup
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/lifemind_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "lifemind_*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/lifemind_$DATE.sql.gz s3://your-backup-bucket/
```

Schedule with cron:

```bash
# Backup daily at 2 AM
0 2 * * * /usr/local/bin/backup-lifemind.sh
```

---

## Monitoring & Logging

### Application Logging

Update `config.py`:

```python
import logging
from logging.handlers import RotatingFileHandler

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('/var/log/lifemind/app.log', maxBytes=10485760, backupCount=10),
        logging.StreamHandler()
    ]
)
```

### Health Checks

Add to monitoring:

```bash
# Check API health
curl https://yourdomain.com/health

# Check database connection
curl https://yourdomain.com/api/v1/health
```

### Error Tracking (Sentry)

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment="production"
)
```

---

## Performance Optimization

### Backend

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_user_id ON expenses(user_id);
   CREATE INDEX idx_scheduled_time ON reminders(scheduled_time);
   CREATE INDEX idx_created_at ON notifications(created_at);
   ```

2. **Query Optimization**
   - Use pagination for large datasets
   - Implement caching for frequently accessed data
   - Use database connection pooling

3. **API Rate Limiting**
   ```python
   from slowapi import Limiter
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   ```

### Frontend

1. **Code Splitting**
   ```javascript
   const SettingsPage = lazy(() => import('./pages/SettingsPage'));
   ```

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Compress images

3. **Bundle Analysis**
   ```bash
   npm run build -- --analyze
   ```

---

## Security Hardening

### Backend

1. **HTTPS Only**
   ```python
   app.add_middleware(
       TrustedHostMiddleware,
       allowed_hosts=["yourdomain.com", "www.yourdomain.com"]
   )
   ```

2. **CORS Configuration**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],
       allow_credentials=True,
       allow_methods=["GET", "POST", "PUT", "DELETE"],
       allow_headers=["*"],
   )
   ```

3. **Rate Limiting**
   - Implement per-user rate limits
   - Protect login endpoint
   - Implement exponential backoff

4. **Input Validation**
   - Use Pydantic for all inputs
   - Sanitize user data
   - Validate file uploads

### Frontend

1. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline'">
   ```

2. **Secure Storage**
   - Use httpOnly cookies for tokens (if possible)
   - Implement token refresh mechanism
   - Clear sensitive data on logout

---

## Scaling Strategy

### Horizontal Scaling

1. **Load Balancing**
   - Use Nginx or HAProxy
   - Implement sticky sessions for WebSockets
   - Health checks every 10 seconds

2. **Database Replication**
   - Primary-replica setup
   - Read replicas for analytics
   - Automatic failover

3. **Caching Layer**
   - Redis for session storage
   - Cache frequently accessed data
   - Implement cache invalidation

### Vertical Scaling

1. **Server Resources**
   - Monitor CPU and memory usage
   - Scale up as needed
   - Use auto-scaling groups

2. **Database Optimization**
   - Increase connection pool size
   - Optimize slow queries
   - Archive old data

---

## Disaster Recovery

### Backup Strategy

- Daily automated backups
- Weekly full backups
- Monthly archive backups
- Test restore procedures monthly

### Recovery Procedures

1. **Database Failure**
   ```bash
   # Restore from backup
   psql -U lifemind_user lifemind_prod < backup.sql
   ```

2. **Application Failure**
   ```bash
   # Restart service
   sudo systemctl restart lifemind-api
   ```

3. **Complete Outage**
   - Failover to backup server
   - Restore from latest backup
   - Verify data integrity

---

## Monitoring Checklist

- [ ] API response times < 200ms
- [ ] Database query times < 100ms
- [ ] Error rate < 0.1%
- [ ] Uptime > 99.9%
- [ ] CPU usage < 80%
- [ ] Memory usage < 85%
- [ ] Disk usage < 90%
- [ ] SSL certificate valid
- [ ] Backups running daily
- [ ] Logs being collected

---

## Post-Deployment

### 1. Smoke Tests

```bash
# Test login
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://yourdomain.com/api/v1/habits
```

### 2. User Acceptance Testing

- Test all features in production
- Verify dark mode works
- Test notifications
- Verify email sending
- Test on multiple browsers

### 3. Performance Baseline

- Measure API response times
- Monitor database performance
- Track error rates
- Establish alerting thresholds

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check system health
- Verify backups completed

### Weekly
- Review performance metrics
- Update dependencies
- Test disaster recovery

### Monthly
- Security audit
- Performance optimization
- User feedback review

### Quarterly
- Major version updates
- Infrastructure review
- Capacity planning

---

## Support & Troubleshooting

### Common Issues

**API not responding**
```bash
sudo systemctl status lifemind-api
sudo journalctl -u lifemind-api -n 50
```

**Database connection errors**
```bash
sudo -u postgres psql -c "SELECT datname FROM pg_database;"
```

**SSL certificate issues**
```bash
sudo certbot renew --dry-run
```

---

## Conclusion

This deployment guide provides a production-ready setup for LifeMind AI. Follow all security recommendations and maintain regular backups for optimal performance and reliability.

For questions or issues, refer to the documentation or contact support.
