'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
            Booking.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }

    Booking.init(
        {
            spotId: { type: DataTypes.INTEGER, allowNull: false },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            startDate: {
                type: DataTypes.DATE,
                validate: {
                    isDate: true,
                },
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                validate: {
                    isDate: true,
                },
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Booking',
        }
    );

    return Booking;
};
