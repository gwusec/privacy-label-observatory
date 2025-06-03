// testDateArg.js
function getCurrentDateFromArg() {
    const argDate = process.argv[2];
    if (argDate) {
        const isValid = /^\d{4}-\d{2}-\d{2}$/.test(argDate);
        if (!isValid) {
            console.error("Invalid date format. Use YYYY-MM-DD.");
            process.exit(1);
        }
        return argDate;
    }

    const today = new Date();
    return today.toISOString().split('T')[0];
}

function main() {
    const date = getCurrentDateFromArg();
    console.log("Resolved date:", date);
}

main();
