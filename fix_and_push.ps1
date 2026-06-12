# Complete Fix and Push Script
# Fixes React/Framer Motion conflict and pushes to GitHub

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  LifeMind AI - Fix React Conflict and Push to GitHub" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to frontend and clean install
Write-Host "Step 1: Cleaning frontend dependencies..." -ForegroundColor Yellow
Set-Location ".\frontend"

if (Test-Path "node_modules") {
    Write-Host "  Removing node_modules..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "node_modules"
}

if (Test-Path "package-lock.json") {
    Write-Host "  Removing package-lock.json..." -ForegroundColor Gray
    Remove-Item -Force "package-lock.json"
}

Write-Host "✅ Cleanup complete" -ForegroundColor Green

# Step 2: Install fresh dependencies
Write-Host ""
Write-Host "Step 2: Installing dependencies with Framer Motion 11..." -ForegroundColor Yellow
Write-Host "  (This may take 2-3 minutes)" -ForegroundColor Gray

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Step 3: Verify Framer Motion version
Write-Host ""
Write-Host "Step 3: Verifying Framer Motion version..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$framerVersion = $packageJson.dependencies.'framer-motion'

Write-Host "  Framer Motion version: $framerVersion" -ForegroundColor Cyan

if ($framerVersion -like "*11.*") {
    Write-Host "✅ Correct version (React 19 compatible)" -ForegroundColor Green
} else {
    Write-Host "❌ Wrong version! Should be 11.x" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Step 4: Test build
Write-Host ""
Write-Host "Step 4: Testing production build..." -ForegroundColor Yellow

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 5: Return to root and commit
Write-Host ""
Write-Host "Step 5: Committing changes to Git..." -ForegroundColor Yellow
Set-Location ".."

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "  Initializing Git..." -ForegroundColor Gray
    git init
    git branch -M main
}

# Check/add remote
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "  Adding remote repository..." -ForegroundColor Gray
    git remote add origin https://github.com/HARESH1501/life_mind_ai.git
}

# Stage all changes
Write-Host "  Staging files..." -ForegroundColor Gray
git add .

# Commit
Write-Host "  Creating commit..." -ForegroundColor Gray
git commit -m "Fix: Upgrade Framer Motion to v11 for React 19 compatibility

- Updated framer-motion from ^10.16.0 to ^11.15.0
- Resolves ERESOLVE peer dependency conflict
- Now compatible with React 19.2.6
- Fixes Render deployment issue"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nothing to commit or commit failed" -ForegroundColor Yellow
    $response = Read-Host "Continue with push anyway? (y/n)"
    if ($response -ne "y") {
        exit 1
    }
}

Write-Host "✅ Changes committed" -ForegroundColor Green

# Step 6: Push to GitHub
Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "  Repository: https://github.com/HARESH1501/life_mind_ai" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  You may need to enter credentials:" -ForegroundColor Yellow
Write-Host "  Username: HARESH1501" -ForegroundColor White
Write-Host "  Password: <your-github-personal-access-token>" -ForegroundColor White
Write-Host ""

$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    git branch -M main
    $currentBranch = "main"
}

git push -u origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS! All changes pushed to GitHub" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "What was fixed:" -ForegroundColor Yellow
    Write-Host "  ✅ Framer Motion upgraded to v11.15.0 (React 19 compatible)" -ForegroundColor White
    Write-Host "  ✅ package-lock.json regenerated" -ForegroundColor White
    Write-Host "  ✅ Build tested and working" -ForegroundColor White
    Write-Host "  ✅ Changes committed and pushed" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Go to Render dashboard" -ForegroundColor White
    Write-Host "  2. Render will auto-detect the push" -ForegroundColor White
    Write-Host "  3. Click 'Manual Deploy' if it doesn't start automatically" -ForegroundColor White
    Write-Host "  4. Watch the build logs - should succeed now! ✅" -ForegroundColor White
    Write-Host ""
    Write-Host "Repository: https://github.com/HARESH1501/life_mind_ai" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ❌ Push Failed" -ForegroundColor Red
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Authentication Failed:" -ForegroundColor White
    Write-Host "   - GitHub no longer accepts passwords" -ForegroundColor Gray
    Write-Host "   - You need a Personal Access Token (PAT)" -ForegroundColor Gray
    Write-Host "   - Create one: https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "   - Use PAT as password when pushing" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Repository doesn't exist:" -ForegroundColor White
    Write-Host "   - Create it: https://github.com/new" -ForegroundColor Gray
    Write-Host "   - Name: life_mind_ai" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Permission denied:" -ForegroundColor White
    Write-Host "   - Check you have write access" -ForegroundColor Gray
    Write-Host "   - Verify you're logged into correct GitHub account" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To retry push manually:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
}
