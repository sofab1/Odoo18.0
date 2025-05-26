@echo off
echo ========================================
echo    Odoo 18.0 Dynamic Dashboard Startup
echo ========================================
echo.

REM Activate virtual environment
echo [1/3] Activating virtual environment...
call venv\Scripts\activate

REM Check if Odoo is configured
if not exist odoo.conf (
    echo ERROR: odoo.conf not found!
    echo Please configure your database settings first.
    pause
    exit /b 1
)

REM Start Odoo server
echo [2/3] Starting Odoo server...
echo.
echo Dashboard will be available at: http://localhost:8069
echo Default login: admin / admin
echo.
echo [3/3] Launching Odoo...
echo Press Ctrl+C to stop the server
echo.

python odoo\odoo-bin -c odoo.conf

echo.
echo Odoo server stopped.
pause
