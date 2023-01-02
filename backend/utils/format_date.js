const toReadableDateUTC = (date) => {
    const dateObject = new Date(date);

    const year = dateObject.getUTCFullYear();
    const month = dateObject.getUTCMonth() + 1;
    const day = dateObject.getUTCDate();

    return `${year}-${month}-${day}`;
    // return `${month}-${day}-${year}`;
};

module.exports = toReadableDateUTC;
