#!/bin/bash

# Set the path to Node.js (adjust if needed)
NODE_PATH=$(which node)

# Log file for tracking updates
LOG_FILE="database_update_$(date +"%Y%m%d_%H%M%S").log"

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
    echo "Running $1 at $(date)" | tee -a "$LOG_FILE"
    if [ -n "$DATE_ARG" ]; then
        "$NODE_PATH" "$1" "$DATE_ARG" 2>&1 | tee -a "$LOG_FILE"
    else
        "$NODE_PATH" "$1" 2>&1 | tee -a "$LOG_FILE"
    fi

    if [ $? -eq 0 ]; then
        echo "$1 completed successfully" | tee -a "$LOG_FILE"
    else
        echo "ERROR: $1 failed" | tee -a "$LOG_FILE"
        exit 1
    fi
}

# Run update scripts
run_update_script "updateDateIndex.js"
run_update_script "graph3.js"
run_update_script "vennIndex.js"
run_update_script "initializePurpose.js"
run_update_script "initializeMatrix.js"
run_update_script "initializeRatioDC.js"
run_update_script "initializeRatioDT.js"
run_update_script "initializeGenre.js"
run_update_script "initializeYear.js"

echo "All database updates completed" | tee -a "$LOG_FILE"
