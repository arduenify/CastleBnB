'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'Spots',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                ownerId: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: { model: 'Users', key: 'id' },
                    onDelete: 'CASCADE',
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                city: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                state: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                country: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                lat: {
                    type: Sequelize.NUMERIC,
                    allowNull: false,
                },
                lng: {
                    type: Sequelize.NUMERIC,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                price: {
                    type: Sequelize.NUMERIC(6, 2),
                    allowNull: false,
                    min: 0,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                schema: 'airbnb_clone',
            }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Spots', {
            schema: 'airbnb_clone',
        });
    },
};
