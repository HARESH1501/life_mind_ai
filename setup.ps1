# LifeMind AI - Setup Script (Windows)

Write-Host "Starting LifeMind AI Setup..."

# 1. Check for Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker Desktop to proceed with containerized deployment." -ForegroundColor Red
} else {
    Write-Host "Docker found."
}

# 2. Setup Environment Variables
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from template..."
    
    # Generate random strings compatible with PS 5.1 and above
    $passChars = [char[]](33..126)
    $dbPass = (-join ($passChars | Get-Random -Count 16))
    $secretKey = (-join ($passChars | Get-Random -Count 32))
    
    $envContent = @"
POSTGRES_USER=lifemind_user
POSTGRES_PASSWORD=$dbPass
POSTGRES_DB=lifemind_db
SECRET_KEY=$secretKey
ENVIRONMENT=production
"@
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host ".env file created with secure random passwords."
} else {
    Write-Host ".env file already exists. Skipping creation."
}

# 3. Backend Setup (Local Dev)
Write-Host "Setting up Backend..."
Set-Location -Path "backend"
if (!(Test-Path "venv")) {
    python -m venv venv
    Write-Host "Virtual environment created."
}
.\venv\Scripts\pip install -r requirements.txt
Set-Location -Path ".."

# 4. Frontend Setup (Local Dev)
Write-Host "Setting up Frontend..."
Set-Location -Path "frontend"
npm install
Set-Location -Path ".."

Write-Host "`nSetup Complete! You can now run the project using:"
Write-Host "./deploy.ps1"
