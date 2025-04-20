#!/bin/bash

# Set the path to Node.js (adjust if needed)
NODE_PATH=$(which node)

# Optional date input
DATE_ARG=""

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --date)
            DATE_ARG="$2"
            shift 2
            ;;
        *)
            echo "Unknown parameter passed: $1"
            exit 1
            ;;
    esac
done

# Function to run update script and log output
run_update_script() {
    if [ -n "$DATE_ARG" ]; then
        "$NODE_PATH" "$1" "$DATE_ARG" 2>&1 
    else
        "$NODE_PATH" "$1" 2>&1 
    fi

    if [ $? -eq 0 ]; then
        echo "$1 completed successfully" 
    else
        echo "ERROR: $1 failed" 
        exit 1
    fi
}

# Run update scripts
run_update_script "testDateArg.js"