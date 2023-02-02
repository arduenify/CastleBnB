'use strict';

const { User, Spot, Review } = require('../models');
const { Op } = require('sequelize');

const reviews = [
    {
        userId: 1,
        spotId: 1,
        review: 'Quite a succulent castle, this was!',
        stars: 5,
    },
    {
        userId: 1,
        spotId: 2,
        review: 'Indubitably, this was a very good castle. I felt as if I were part of the royal family!',
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
        review: 'The apprentice magicians at this castle were very eager to learn!',
        stars: 5,
    },
    {
        userId: 2,
        spotId: 2,
        review: 'Although the castle was quite nice, I was not a fan of the royal family.',
        stars: 4,
    },
    {
        userId: 2,
        spotId: 3,
        review: "There was something about this place that I just couldn't put my nose on.",
        stars: 2,
    },
];

const reviewImages = [
    {
        reviewId: 1,
        url: 'ochre_court/reviews/1.jpg',
    },
    {
        reviewId: 2,
        url: 'windsor/reviews/1.jpg',
    },
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
