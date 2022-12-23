'use strict';

const { User, Spot } = require('../models');

const spots = [
    {
        ownerId: 1,
        address: '111 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.1174,
        lng: 122.1194,
        name: "Adam's Spot",
        description: 'This is my spot',
        price: 100,
    },
    {
        ownerId: 2,
        address: '222 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.2286,
        lng: 122.2294,
        name: "Adam's 2nd Spot",
        description: 'This is my 2nd spot',
        price: 200,
    },
    {
        ownerId: 1,
        address: '333 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.3398,
        lng: 122.3336,
        name: "Adam's 3rd Spot",
        description: 'This is my 3rd spot',
        price: 300,
    },
];

// Spot Images
const spotImages = [
    {
        spotId: 1,
        url: 'great_image.jpg',
        preview: true,
    },
    {
        spotId: 1,
        url: 'great_image2.jpg',
        preview: false,
    },
    {
        spotId: 2,
        url: 'awesome_image.png',
        preview: false,
    },
    {
        spotId: 3,
        url: 'awesome_image2.png',
        preview: true,
    },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Spots', spots, {});
        await queryInterface.bulkInsert('SpotImages', spotImages, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Spots', spots, {});
        await queryInterface.bulkDelete('SpotImages', spotImages, {});
    },
};
