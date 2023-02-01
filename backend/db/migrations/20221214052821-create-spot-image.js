'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'SpotImages',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                spotId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Spots',
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                preview: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
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
            process.env.NODE_ENV === 'production' && {
                schema: process.env.DB_SCHEMA || 'castlebnb',
            }
        );

        await queryInterface.addIndex(
            'SpotImages',
            {
                unique: true,
                fields: ['spotId', 'preview'],
                where: {
                    preview: true,
                },
            },
            process.env.NODE_ENV === 'production' && {
                schema: process.env.DB_SCHEMA || 'castlebnb',
            }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('SpotImages');

        await queryInterface.removeIndex(
            'SpotImages',
            {
                unique: true,
                fields: ['spotId', 'preview'],
                where: {
                    preview: true,
                },
            },
            {
                schema: process.env.DB_SCHEMA || 'castlebnb',
            }
        );
    },
};
