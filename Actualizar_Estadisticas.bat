@echo off
chcp 65001 > nul
title Actualizar Estadísticas - Campos de Rap
powershell -ExecutionPolicy Bypass -File "%~dp0update_stats_dialog.ps1"
echo.
echo Presione cualquier tecla para salir...
pause > nul
