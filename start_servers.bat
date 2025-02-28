@echo off
echo Starting servers...

:: Démarrer le serveur backend (FastAPI)
start cmd /k "cd app\back && python -m uvicorn src.main:app --reload"

:: Attendre quelques secondes pour que le backend démarre
timeout /t 5

:: Démarrer le serveur frontend (React)
start cmd /k "cd app\front && npm start"

echo Servers are starting...
echo Backend will be available at http://localhost:8000
echo Frontend will be available at http://localhost:3000
echo.
echo To stop the servers, close the terminal windows or press Ctrl+C in each window
pause 