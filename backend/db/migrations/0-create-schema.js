'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const allSchemas = await queryInterface.sequelize.showAllSchemas();

        console.log('AllSchemas: ', allSchemas);

        if (!allSchemas.includes('airbnb_clone')) {
            const result = await Sequelize.createSchema('airbnb_clone');
            console.log('Create Schema Result: ', result);
        }
    },

    async down(queryInterface, Sequelize) {
        await Sequelize.dropSchema('airbnb_clone');
    },
};
