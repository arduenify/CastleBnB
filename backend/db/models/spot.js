'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Spot extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Spot.init(
        {
            ownerId: DataTypes.INTEGER,
            address: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
            country: DataTypes.STRING,
            lat: DataTypes.NUMERIC,
            lng: DataTypes.NUMERIC,
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.NUMERIC,
        },
        {
            sequelize,
            modelName: 'Spot',
        }
    );
    return Spot;
};
