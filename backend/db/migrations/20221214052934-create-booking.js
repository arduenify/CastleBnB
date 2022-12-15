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
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            startDate: {
                type: Sequelize.DATE,
            },
            endDate: {
                type: Sequelize.DATE,
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
        });

        await queryInterface.addConstraint('Bookings', {
            ['endDate']: {
                type: 'check',
                where: {
                    endDate: {
                        [Sequelize.Op.gt]: Sequelize.col('startDate'),
                    },
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Bookings');
    },
};
