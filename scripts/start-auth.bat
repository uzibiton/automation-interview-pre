@echo off
echo Installing Auth Service dependencies...
cd /d %~dp0app\services\auth-service
call npm install --no-workspaces
echo.
echo Starting Auth Service on port 3001...
call npm run start:dev --no-workspaces
pause
