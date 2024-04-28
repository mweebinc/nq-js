function dateToMMDDYY(isoDateString){
    const date = new Date(isoDateString);
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed; add 1
    const day = date.getDate().toString().padStart(2, '0');
    return month + day + year;
}
module.exports = dateToMMDDYY;