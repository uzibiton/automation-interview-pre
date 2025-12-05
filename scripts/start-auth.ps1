# Start Auth Service
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Auth Service Startup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\app\services\auth-service"

Write-Host "Installing dependencies (if needed)..." -ForegroundColor Yellow
npm install --no-workspaces --silent

Write-Host ""
Write-Host "Starting Auth Service on http://localhost:3001" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run start:dev --no-workspaces
