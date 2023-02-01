'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'ReviewImages',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                reviewId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Reviews',
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            process.env.NODE_ENV === 'production' && {
                schema: process.env.DB_SCHEMA || 'castlebnb',
            }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ReviewImages', {
            schema: process.env.DB_SCHEMA || 'castlebnb',
        });
    },
};
