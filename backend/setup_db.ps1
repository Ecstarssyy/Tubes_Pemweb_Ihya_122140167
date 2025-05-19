# Set PostgreSQL path and password
$env:Path += ";C:\Program Files\PostgreSQL\17\bin"
$env:PGPASSWORD = '282017'

Write-Host "Creating database if it doesn't exist..."
$dbExists = psql -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname = 'event_organizer'" 2>$null
if ($LASTEXITCODE -eq 0) {
    if ($dbExists) {
        Write-Host "Database already exists"
    } else {
        Write-Host "Creating database..."
        psql -U postgres -c "CREATE DATABASE event_organizer"
    }
} else {
    Write-Host "Failed to connect to PostgreSQL. Please check if PostgreSQL is running and the path is correct."
    exit 1
}

Write-Host "Running migrations..."
.\.venv\Scripts\activate.ps1
python -m alembic upgrade head

Write-Host "Initializing database with sample data..."
python -m backend.scripts.initialize_db development.ini

Write-Host "Database setup completed!"
