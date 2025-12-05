# Start Frontend
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Frontend Startup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\app\frontend"

Write-Host "Starting Frontend on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run dev
