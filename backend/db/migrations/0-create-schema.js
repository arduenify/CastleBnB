'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const allSchemas = await queryInterface.sequelize.showAllSchemas();

        if (!allSchemas.includes('airbnb_clone')) {
            await Sequelize.createSchema('airbnb_clone');
        }
    },

    async down(queryInterface, Sequelize) {
        await Sequelize.dropSchema('airbnb_clone');
    },
};
