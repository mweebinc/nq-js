function formatNumber(number, minimum) {
    return number.toLocaleString('en-US', {
        minimumIntegerDigits: minimum,
        useGrouping: false
    })
}

module.exports = formatNumber;
