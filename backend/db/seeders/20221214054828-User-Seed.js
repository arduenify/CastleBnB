'use strict';

const bcrypt = require('bcryptjs');

const users = [
    {
        firstName: 'Adam',
        lastName: 'Scoggins',
        email: 'adamscoggins@aa.io',
        username: 'adamscoggins',
        passwordHash: bcrypt.hashSync('iloveaa'),
    },
    {
        firstName: 'Philip',
        lastName: 'Ling',
        email: 'philipling@aa.io',
        username: 'philipling',
        passwordHash: bcrypt.hashSync('bestleadinstructor'),
    },
    {
        firstName: 'Collin',
        lastName: 'Smith',
        email: 'collinsmith@aa.io',
        username: 'collinsmith',
        passwordHash: bcrypt.hashSync('solongfriend'),
    },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', users, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', users, {});
    },
};
