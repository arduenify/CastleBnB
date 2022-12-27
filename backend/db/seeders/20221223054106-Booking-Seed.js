'use strict';

const { User, Spot, SpotImage } = require('../models');

const bookingSeed = [
    {
        spotId: 1,
        userId: 1, // Adam
        startDate: '2022-12-25',
        endDate: '2023-01-03',
    },
    {
        spotId: 2,
        userId: 1, // Adam
        startDate: '2023-12-25',
        endDate: '2024-01-03',
    },
    {
        spotId: 1,
        userId: 2, // Philip
        startDate: '2022-01-04',
        endDate: '2022-01-06',
    },
    {
        spotId: 2,
        userId: 2, // Philip
        startDate: '2023-01-04',
        endDate: '2023-01-06',
    },
];

bookingSeed.forEach((booking) => {
    booking.startDate = new Date(booking.startDate);
    booking.endDate = new Date(booking.endDate);
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Bookings', bookingSeed);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Bookings', bookingSeed);
    },
};
