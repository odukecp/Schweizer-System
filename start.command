#!/bin/bash

# Change to the project directory
cd "$(dirname "$0")"

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. It usually comes with Node.js. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if node_modules/ directory exists, if not, run npm install
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install..."
    npm install
fi

# Check if node backend/server.js is already running
if pgrep -f "node backend/server.js" > /dev/null; then
    echo "Node server is already running. Killing the process..."
    pkill -f "node backend/server.js"
fi

# Start the server in the background with timestamps in the log
(
    if command -v gawk &> /dev/null; then
        # Use gawk if available
        node backend/server.js 2>&1 | gawk '{ print strftime("[%Y-%m-%d %H:%M:%S]"), $0 }' >> logs/server.log
    else
        # Fallback to date and sed if gawk is not available
        node backend/server.js 2>&1 | sed "s/^/[$(date '+%Y-%m-%d %H:%M:%S')] /" >> logs/server.log
    fi
) &

# Open the frontend in the default browser
open frontend/index.html
