@echo off
echo Starting Frontend on port 3000...
cd /d %~dp0app\frontend
call npm run dev
pause
