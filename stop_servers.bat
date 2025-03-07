@echo off
echo Stopping servers...

:: Tuer le processus Node.js (React)
taskkill /F /IM node.exe /T

:: Tuer le processus Python (FastAPI)
taskkill /F /IM python.exe /T

echo Servers stopped.
pause 