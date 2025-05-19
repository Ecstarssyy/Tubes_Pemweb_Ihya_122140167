# Setup script for Event Organizer application
$ErrorActionPreference = "Stop"

function Write-Step {
    param($Message)
    Write-Host "`n🚀 $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    exit 1
}

Write-Step "Starting Event Organizer setup..."

# Check Python installation
Write-Step "Checking Python installation..."
try {
    $pythonVersion = python --version
    if ($pythonVersion -match "Python 3.12") {
        Write-Success "Found $pythonVersion"
    } else {
        Write-Error "Python 3.12 or higher is required. Current version: $pythonVersion"
    }
} catch {
    Write-Error "Python is not installed or not in PATH"
}

# Create and activate virtual environment
Write-Step "Setting up Python virtual environment..."
if (-not (Test-Path ".\venv")) {
    python -m venv venv
}

# Set execution policy for virtual environment activation
Write-Step "Setting PowerShell execution policy for venv activation..."
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Activate virtual environment
Write-Step "Activating virtual environment..."
.\venv\Scripts\Activate.ps1

# Install backend dependencies
Write-Step "Installing backend Python dependencies..."
Set-Location backend
python -m pip install --upgrade pip
pip install -r requirements.txt

# Check PostgreSQL
Write-Step "Checking PostgreSQL installation..."
try {
    $pgVersion = psql --version
    Write-Success "PostgreSQL found: $pgVersion"
} catch {
    Write-Error "PostgreSQL is not installed or not in PATH. Please install PostgreSQL."
}

# Create database
Write-Step "Setting up PostgreSQL database..."
$env:PGPASSWORD = "postgres"
psql -U postgres -c "DROP DATABASE IF EXISTS event_organizer;" -c "CREATE DATABASE event_organizer;"

# Run database migrations
Write-Step "Running database migrations..."
alembic upgrade head

# Initialize database with sample data
Write-Step "Initializing database with sample data..."
python scripts/initialize_db.py development.ini

# Return to root and install frontend dependencies
Set-Location ..
Write-Step "Installing frontend dependencies..."
npm install

Write-Success "`nSetup complete! You can now start the application:"
Write-Host "1. Start the backend (in a new terminal):" -ForegroundColor Yellow
Write-Host "   cd backend; python -m waitress --port=5000 --call 'app:main'" -ForegroundColor White
Write-Host "2. Start the frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
