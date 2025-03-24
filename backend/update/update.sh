# Bash Script (Linux/macOS)
#!/bin/bash

# Set the path to Node.js (adjust if needed)
NODE_PATH=$(which node)

# Log file for tracking updates
LOG_FILE="database_update_$(date +"%Y%m%d_%H%M%S").log"

# Function to run update script and log output
run_update_script() {
    echo "Running $1 at $(date)" | tee -a "$LOG_FILE"
    "$NODE_PATH" "$1" 2>&1 | tee -a "$LOG_FILE"
    
    # Check the exit status
    if [ $? -eq 0 ]; then
        echo "$1 completed successfully" | tee -a "$LOG_FILE"
    else
        echo "ERROR: $1 failed" | tee -a "$LOG_FILE"
        exit 1
    fi
}

# Run update scripts in sequence
run_update_script "updateDateIndex.js"
run_update_script "graph3.js"
run_update_script "vennIndex.js"

echo "All database updates completed" | tee -a "$LOG_FILE"