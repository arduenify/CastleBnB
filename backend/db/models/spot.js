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
            Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });

            Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
            Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
            Spot.hasMany(models.Review, { foreignKey: 'spotId' });

            Spot.hasOne(models.SpotImage, {
                foreignKey: 'spotId',
                as: 'previewImage',
                constraints: false,
                scope: {
                    preview: true,
                },
            });
        }

        static formatResponse(spot, numReviews = 0) {
            const {
                id,
                ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
                createdAt,
                updatedAt,
                SpotImages,
                avgStarRating = null,
            } = spot.dataValues;

            // console.dir(spot);
            const { firstName, lastName } = spot.dataValues.Owner;

            return {
                id,
                ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
                createdAt,
                updatedAt,
                numReviews,
                avgStarRating,
                SpotImages,
                Owner: {
                    id: ownerId,
                    firstName,
                    lastName,
                },
            };
        }

        static formatSpotsResponse(spots) {
            const formattedSpots = spots.map((spot) => {
                const {
                    id,
                    ownerId,
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                    createdAt,
                    updatedAt,
                    avgRating,
                } = spot.dataValues;

                let url = null;
                if (spot.previewImage) {
                    url = spot.previewImage.url;
                }

                return {
                    id,
                    ownerId,
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                    createdAt,
                    updatedAt,
                    avgRating,
                    previewImage: url ?? null,
                };
            });

            return { Spots: formattedSpots };
        }

        static formatSpotsQueryResponse(spots, page, size) {
            const formattedSpots = spots.map((spot) => {
                const {
                    id,
                    ownerId,
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                    createdAt,
                    updatedAt,
                } = spot.dataValues;

                let url = null;
                if (spot.previewImage) {
                    url = spot.previewImage.url;
                }

                return {
                    id,
                    ownerId,
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                    createdAt,
                    updatedAt,
                    previewImage: url ?? null,
                };
            });

            return {
                Spots: formattedSpots,
                page: parseInt(page),
                size: parseInt(size),
            };
        }

        // get SpotImages() {
        //     return this.SpotImages;
        // }

        getPreviewImage() {
            return this.SpotImages.find((image) => image.preview);
        }
    }

    Spot.init(
        {
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lat: {
                type: DataTypes.NUMERIC,
                allowNull: false,
            },
            lng: {
                type: DataTypes.NUMERIC,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validation: {
                    len: [1, 50],
                },
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.NUMERIC(0, 2),
                allowNull: false,
                validation: {
                    min: 0,
                },
            },
        },
        {
            sequelize,
            modelName: 'Spot',
        }
    );

    return Spot;
};
