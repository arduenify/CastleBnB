const addLeadingZero = (digit) => {
    if (digit < 10) {
        return `0${digit}`;
    }

    return digit;
};

/**
 * Formats a date to the following format: YYYY-MM-DD
 *
 * Created to format the `startDate` and `endDate` fields
 */
const toReadableDateUTC = (date) => {
    const dateObject = new Date(date);

    const year = dateObject.getUTCFullYear();
    const month = dateObject.getUTCMonth() + 1;
    const day = dateObject.getUTCDate();

    return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
};

/**
 * Formats a date to the following format: YYYY-MM-DD HH:mm:ss
 *
 * Created to format the `createdAt` and `updatedAt` fields
 */
const formatDate = (date) => {
    const dateObject = new Date(date);

    const year = dateObject.getUTCFullYear();
    const month = addLeadingZero(dateObject.getUTCMonth() + 1);
    const day = addLeadingZero(dateObject.getUTCDate());
    const hour = addLeadingZero(dateObject.getUTCHours());
    const minute = addLeadingZero(dateObject.getUTCMinutes());
    const second = addLeadingZero(dateObject.getUTCSeconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

module.exports = {
    toReadableDateUTC,
    formatDate,
};
