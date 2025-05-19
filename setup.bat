@echo off
echo Setting up the Event Organizer application...

:: Create Python virtual environment
python -m venv venv
call .\venv\Scripts\activate

:: Install Python dependencies
cd backend
pip install -r requirements.txt

:: Create the database
powershell -Command "&{
    $postgres = 'postgres'
    $dbname = 'event_organizer'
    
    Write-Host 'Creating database...'
    psql -U $postgres -c 'CREATE DATABASE event_organizer;'
}"

:: Initialize and run migrations
alembic upgrade head

:: Initialize database with sample data
python scripts\initialize_db.py development.ini

cd ..

:: Install Node.js dependencies
npm install

echo Setup complete! You can now run:
echo - Backend: cd backend ^& uvicorn app:app --reload
echo - Frontend: npm run dev
