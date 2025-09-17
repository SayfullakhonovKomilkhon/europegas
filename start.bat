@echo off
echo Starting EuropeGAS Store application...
cd /d %~dp0
echo Current directory: %CD%
if exist package.json (
    echo Found package.json in current directory
    npm start
) else (
    echo package.json not found in current directory
    echo Checking parent directory...
    cd ..
    if exist package.json (
        echo Found package.json in parent directory
        npm start
    ) else (
        echo ERROR: Could not find package.json
        echo Please run this batch file from the project root directory
        pause
    )
) 