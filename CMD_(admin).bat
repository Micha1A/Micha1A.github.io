taskkill /F /IM python.exe
@echo off
:: Prüfen, ob das Skript bereits als Admin läuft
net session >nul 2>&1

if %errorLevel% == 0 (
    :: Wir sind Admin -> Gehe zum Pfad der Batch-Datei
    cd /d "%~dp0"
    echo Admin-Rechte bestaetigt. Pfad gesetzt.
    :: Öffne die CMD und bleibe offen (/k)
    cmd /k
) else (
    :: Keine Admin-Rechte -> Starte CMD neu als Admin mit dem aktuellen Pfad als Argument
    echo Fordere Admin-Rechte an...
    powershell -Command "Start-Process cmd -ArgumentList '/k cd /d """%~dp0"""' -Verb RunAs"
    exit
)