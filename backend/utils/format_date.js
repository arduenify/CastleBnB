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

    return `${year}-${month}-${day}`;
};

/**
 * Formats a date to the following format: YYYY-MM-DD HH:mm:ss
 *
 * Created to format the `createdAt` and `updatedAt` fields
 */
const formatDate = (date) => {
    const dateObject = new Date(date);

    const year = dateObject.getUTCFullYear();
    const month = dateObject.getUTCMonth() + 1;
    const day = dateObject.getUTCDate();
    const hour = dateObject.getUTCHours();
    const minute = dateObject.getUTCMinutes();
    const second = dateObject.getUTCSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

module.exports = {
    toReadableDateUTC,
    formatDate,
};
