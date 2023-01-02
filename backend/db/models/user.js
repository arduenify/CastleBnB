'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Booking, { foreignKey: 'userId' });
            User.hasMany(models.Review, { foreignKey: 'userId' });
            User.hasMany(models.Spot, { foreignKey: 'ownerId' });
        }

        toSafeObject() {
            const { id, firstName, lastName, email, username } = this;
            return { id, firstName, lastName, email, username };
        }

        static async login({ credential, password }) {
            const { Op } = require('sequelize');

            const user = await User.scope('login').findOne({
                where: {
                    [Op.or]: {
                        username: credential,
                        email: credential,
                    },
                },
            });

            if (user && user.validatePassword(password)) {
                return await User.scope('currentUser').findByPk(user.id);
            }
        }

        static async signup({
            firstName,
            lastName,
            email,
            username,
            password,
        }) {
            const passwordHash = bcrypt.hashSync(password);

            try {
                const user = await User.create({
                    firstName,
                    lastName,
                    email,
                    username,
                    passwordHash,
                });

                return await User.scope('currentUser').findByPk(user.id);
            } catch (error) {
                return error;
            }
        }

        static async getCurrentUserById(id) {
            const user = await User.scope('currentUser').findByPk(id);

            return user;
        }

        validatePassword(password) {
            return bcrypt.compareSync(password, this.passwordHash.toString());
        }
    }

    User.init(
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'User with that email already exists',
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'User with that username already exists',
                },
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false,
                validation: {
                    len: [64, 64],
                },
            },
        },
        {
            sequelize,
            modelName: 'User',
            defaultScope: {
                attributes: {
                    exclude: [
                        'hashedPassword',
                        'email',
                        'createdAt',
                        'updatedAt',
                        'firstName',
                        'lastName',
                    ],
                },
            },
            scopes: {
                currentUser: {
                    attributes: { exclude: ['hashedPassword'] },
                },
                login: {
                    attributes: {},
                },
            },
        }
    );

    return User;
};
