@echo off
REM College Library Seat Tracker - Windows Batch Script for College Labs
echo ==========================================
echo Compiling College Library Seat Tracker...
echo ==========================================
javac Seat.java LibrarySeatTracker.java

if %ERRORLEVEL% EQU 0 (
    echo Compilation Successful!
    echo Launching Java Console Application...
    echo ==========================================
    java LibrarySeatTracker
) else (
    echo [ERROR] Java compilation failed. Make sure JDK is installed and PATH is set.
)
pause
