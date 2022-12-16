'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Bookings', {
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
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATE,
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
        });

        await queryInterface.addConstraint('Bookings', {
            fields: ['endDate'],
            type: 'check',
            where: {
                endDate: {
                    [Sequelize.Op.gt]: Sequelize.col('startDate'),
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Bookings');
    },
};
