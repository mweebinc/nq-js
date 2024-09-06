function dateFormat(string) {
    // Extract year, month, and day assuming format is YYYY-MM-DD
    const [year, month, day] = string.split('-');
    // Create a mapping of month numbers to month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
    return formattedDate;
}

module.exports = dateFormat;
