@echo off
cd /d %~dp0app\services\api-service
echo Installing API service dependencies...
call npm install --no-workspaces
echo.
echo Starting API Service on port 3002...
call npm run start:dev --no-workspaces
pause
