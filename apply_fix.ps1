# PowerShell Script to Fix React/Framer Motion Conflict
# Run this script to apply the fix

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  React Version Conflict Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Write-Host "Step 1: Navigating to frontend directory..." -ForegroundColor Yellow
Set-Location -Path ".\frontend"

# Delete node_modules
Write-Host "Step 2: Deleting node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ node_modules deleted" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules not found (already clean)" -ForegroundColor Yellow
}

# Delete package-lock.json
Write-Host "Step 3: Deleting package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ package-lock.json deleted" -ForegroundColor Green
} else {
    Write-Host "⚠️  package-lock.json not found" -ForegroundColor Yellow
}

# Install fresh dependencies
Write-Host "Step 4: Installing fresh dependencies..." -ForegroundColor Yellow
Write-Host "(This may take 2-3 minutes)" -ForegroundColor Gray
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Error installing dependencies" -ForegroundColor Red
    exit 1
}

# Test build
Write-Host ""
Write-Host "Step 5: Testing build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Success message
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ FIX APPLIED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test locally: npm run dev" -ForegroundColor White
Write-Host "2. Commit changes: git add . && git commit -m 'Fix React version conflict'" -ForegroundColor White
Write-Host "3. Push to GitHub: git push origin main" -ForegroundColor White
Write-Host "4. Render will auto-deploy!" -ForegroundColor White
Write-Host ""
