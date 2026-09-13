#!/bin/bash
# College Library Seat Tracker - Linux / macOS Run Script
echo "=========================================="
echo "Compiling Java Files..."
echo "=========================================="
javac Seat.java LibrarySeatTracker.java

if [ $? -eq 0 ]; then
    echo "Compilation successful! Starting Java program..."
    echo "=========================================="
    java LibrarySeatTracker
else
    echo "Compilation failed! Check syntax errors."
fi
