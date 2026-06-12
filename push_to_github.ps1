# PowerShell Script to Push LifeMind AI to GitHub
# Repository: https://github.com/HARESH1501/life_mind_ai

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push LifeMind AI to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check current remote
$currentRemote = git remote get-url origin 2>$null

if ($currentRemote) {
    Write-Host "Current remote: $currentRemote" -ForegroundColor Yellow
    $response = Read-Host "Do you want to update it? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        git remote remove origin
        git remote add origin https://github.com/HARESH1501/life_mind_ai.git
        Write-Host "✅ Remote updated" -ForegroundColor Green
    }
} else {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/HARESH1501/life_mind_ai.git
    Write-Host "✅ Remote added: https://github.com/HARESH1501/life_mind_ai.git" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current branch:" -ForegroundColor Yellow
git branch --show-current

Write-Host ""
Write-Host "Checking status..." -ForegroundColor Yellow
git status

Write-Host ""
$response = Read-Host "Do you want to add all files? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Adding all files..." -ForegroundColor Yellow
    git add .
    Write-Host "✅ Files staged" -ForegroundColor Green
    
    Write-Host ""
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Update: Fix React version conflict and complete Settings feature"
    }
    
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "$commitMessage"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Changes committed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Nothing to commit or commit failed" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host "(You may be prompted for GitHub username and password)" -ForegroundColor Gray
    
    # Try to push, handle main/master branch
    $currentBranch = git branch --show-current
    
    if ([string]::IsNullOrWhiteSpace($currentBranch)) {
        Write-Host "Setting default branch to 'main'..." -ForegroundColor Yellow
        git branch -M main
        $currentBranch = "main"
    }
    
    git push -u origin $currentBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ Successfully Pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repository: https://github.com/HARESH1501/life_mind_ai" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Go to Render.com dashboard" -ForegroundColor White
        Write-Host "2. Connect this GitHub repository" -ForegroundColor White
        Write-Host "3. Deploy backend and frontend" -ForegroundColor White
        Write-Host "4. See RENDER_DEPLOYMENT_GUIDE.md for details" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Push failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "1. Authentication - Use GitHub Personal Access Token instead of password" -ForegroundColor White
        Write-Host "2. Repository doesn't exist - Create it first on GitHub" -ForegroundColor White
        Write-Host "3. No permission - Check repository access" -ForegroundColor White
        Write-Host ""
        Write-Host "To create Personal Access Token:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://github.com/settings/tokens" -ForegroundColor White
        Write-Host "2. Generate new token (classic)" -ForegroundColor White
        Write-Host "3. Select 'repo' scope" -ForegroundColor White
        Write-Host "4. Use token as password when pushing" -ForegroundColor White
    }
} else {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
}

Write-Host ""
