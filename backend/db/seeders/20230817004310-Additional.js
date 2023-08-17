'use strict';

const bcrypt = require('bcryptjs');

const additionalUsers = [
    {
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emilyjohnson@test.io',
        username: 'emilyjohnson',
        passwordHash: bcrypt.hashSync('castlelover'),
    },
    {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michaelbrown@test.io',
        username: 'michaelbrown',
        passwordHash: bcrypt.hashSync('royalvisit'),
    },
];

const additionalSpots = [
    {
        ownerId: 2,
        name: 'Edinburgh Castle',
        address: 'Castlehill',
        city: 'Edinburgh',
        state: 'EH1 2NG',
        country: 'UK',
        lat: 55.9486,
        lng: -3.1999,
        description:
            'A historic fortress dominating the skyline of Edinburgh from its position on the Castle Rock.',
        price: 4720,
    },
    {
        ownerId: 3,
        name: 'Neuschwanstein Castle',
        address: 'Neuschwansteinstraße 20',
        city: 'Schwangau',
        state: '87645',
        country: 'Germany',
        lat: 47.5576,
        lng: 10.7498,
        description:
            'A 19th-century Romanesque Revival palace on a rugged hill above the village of Hohenschwangau.',
        price: 5300,
    },
];

const additionalReviews = [
    {
        userId: 4,
        spotId: 9,
        review: 'An incredible castle with a rich history. A must-visit!',
        stars: 5,
    },
    {
        userId: 5,
        spotId: 10,
        review: 'The fairytale castle of my dreams! Absolutely stunning.',
        stars: 5,
    },
];

const additionalBookings = [
    {
        spotId: 9,
        userId: 4,
        startDate: '2023-05-15',
        endDate: '2023-05-20',
    },
    {
        spotId: 10,
        userId: 5,
        startDate: '2023-06-10',
        endDate: '2023-06-15',
    },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', additionalUsers, {});
        await queryInterface.bulkInsert('Spots', additionalSpots, {});
        await queryInterface.bulkInsert('Reviews', additionalReviews, {});
        await queryInterface.bulkInsert('Bookings', additionalBookings, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', additionalUsers, {});
        await queryInterface.bulkDelete('Spots', additionalSpots, {});
        await queryInterface.bulkDelete('Reviews', additionalReviews, {});
        await queryInterface.bulkDelete('Bookings', additionalBookings, {});
    },
};
