# LifeMind AI - Deployment Script (Windows)

Write-Host "🚀 Deploying LifeMind AI with Docker Compose..." -ForegroundColor Cyan

# Ensure .env exists
if (!(Test-Path ".env")) {
    Write-Host "❌ .env file missing. Run ./setup.ps1 first." -ForegroundColor Red
    exit
}

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Build and Start
Write-Host "🔨 Building and starting services..." -ForegroundColor Cyan
docker-compose up --build -d

# Check status
Write-Host "📊 Service Status:" -ForegroundColor Yellow
docker-compose ps

Write-Host "`n✅ Deployment Complete!" -ForegroundColor Green
Write-Host "Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost/api/v1" -ForegroundColor Cyan
Write-Host "Backend Docs: http://localhost:8000/docs (direct) or http://localhost/api/docs" -ForegroundColor Gray
