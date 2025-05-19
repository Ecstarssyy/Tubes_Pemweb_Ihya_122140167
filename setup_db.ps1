# Check if PostgreSQL is installed
$pgPath = "C:\Program Files\PostgreSQL\14\bin"
$env:Path += ";$pgPath"

# Create the database if it doesn't exist
$createDb = @"
CREATE DATABASE event_organizer;
"@

# Try to create the database
Write-Host "Creating database..."
$createDb | & "$pgPath\psql.exe" -U postgres

Write-Host "Database setup completed."
