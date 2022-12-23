'use strict';

const { User, Spot, Review } = require('../models');
const { Op } = require('sequelize');

const reviews = [
    {
        userId: 1,
        spotId: 1,
        review: 'This was an awesome spot!',
        stars: 5,
    },
    {
        userId: 1,
        spotId: 2,
        review: 'This was an awesome spot, too!',
        stars: 5,
    },
    {
        userId: 1,
        spotId: 3,
        review: 'I REALLY disliked this spot. It smelled terrible!',
        stars: 1,
    },
    {
        userId: 2,
        spotId: 1,
        review: 'This was, for sure, an awesome spot!',
        stars: 5,
    },
    {
        userId: 2,
        spotId: 2,
        review: 'This was, for sure, a very good spot, too!',
        stars: 4,
    },
    {
        userId: 2,
        spotId: 3,
        review: "There was something about this spot that I just can't put my nose on",
        stars: 2,
    },
];

const reviewImages = [
    {
        reviewId: 1,
        url: 'amazing_review_image.png',
    },
    // {
    //     reviewId: 2,
    //     url: 'super_cool_review_image.jpeg',
    // },
    // {
    //     reviewId: 2,
    //     url: 'so_cool_it_needed_two_review_images.png',
    // },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await queryInterface.bulkInsert('Reviews', reviews);
            await queryInterface.bulkInsert('ReviewImages', reviewImages);
        } catch (err) {
            console.error(err);
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Reviews', reviews);
        await queryInterface.bulkDelete('ReviewImages', reviewImages);
    },
};
