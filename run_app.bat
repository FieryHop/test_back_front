@echo off


echo [1/5] Setting up backend environment...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt > nul

echo [2/5] Generating JWT secret key...
python -c "import secrets; print(f'JWT_SECRET_KEY={secrets.token_urlsafe(64)}')" > .env

echo [3/5] Initializing database...
python -c "from app import app, db; with app.app_context(): db.create_all()"

echo [4/5] Building frontend...
cd ../frontend
npm install --silent
npm run build --silent

echo [5/5] Starting application...
cd ../backend
start "" python app.py
start "" http://localhost:5000
echo Application is running! Access at: http://localhost:5000
echo Press Ctrl+C to stop the server
