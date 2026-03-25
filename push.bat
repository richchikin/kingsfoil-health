@echo off
cd /d "%~dp0"
set /p message="Commit message: "
git add .
git commit -m "%message%"
git push
pause
