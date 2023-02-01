'use strict';

const spots = [
    {
        ownerId: 1,
        name: 'Ochre Court',
        address: 'Ochre Point Ave',
        city: 'Newport',
        state: 'RI',
        country: 'USA',
        lat: 41.282558,
        lng: -71.175619,
        description:
            'Beautiful, châteauesque, and the second largest mansion in Newport, Ochre court is a must see for any history buff. Built in 1892 at a cost of $4.5 million dollars, the mansion was designed by architect Richard Morris Hunt. ',
        price: 4906,
    },
    {
        ownerId: 1,
        name: 'Windsor Castle',
        address: 'Windsor Rd',
        state: 'N/A',
        city: 'Windsor',
        country: 'UK',
        lat: 51.481813,
        lng: -0.606645,
        description:
            "The official residence of the British royal family, Windsor Castle is a stunning example of medieval architecture and history. Visitors can tour the castle and view the State Apartments, St. George's Chapel, and the Royal Collection.",
        price: 5650,
    },
    {
        ownerId: 1,
        name: 'Castelo de São Jorge',
        address: 'R. de Santa Cruz do Castelo',
        city: 'Lisbon',
        state: 'N/A',
        country: 'Portugal',
        lat: 38.713816,
        lng: -9.139295,
        description:
            "Residing on top of one of Lisbon's seven hills, the Castelo de São Jorge is a historic fortress with a breathtaking view of the city. Experience the rich history of Portugal.",
        price: 4260,
    },
    {
        ownerId: 1,
        name: 'Heidelberg Palace',
        address: 'Schlosshof 1',
        city: 'Heidelberg',
        state: '69117',
        country: 'Germany',
        lat: 49.408595,
        lng: 8.692483,
        description:
            'An 18th century masterpiece of German architecture with a fine-dining experience. If you love gardens and food, you will love Heidelberg Palace.',
        price: 4580,
    },
    {
        ownerId: 1,
        name: "Pomeranian Dukes' Castle",
        address: 'Korsarzy 34',
        state: '70-540',
        city: 'Szczecin',
        country: 'Poland',
        lat: 53.431571,
        lng: 14.551214,
        description:
            'Titled "Zamek Książąt Pomorskich w Szczecinie" in Polish, this is a stunning medieval castle with a lot of history. Explore the ramparts, turrets, and towers of this amazing Polish castle.',
        price: 3980,
    },
    {
        ownerId: 1,
        name: 'Castelo de Guimarães',
        address: 'R. Conde Dom Henrique',
        city: 'Guimarães',
        state: 'N/A',
        country: 'Portugal',
        lat: 41.444889,
        lng: -8.295205,
        description:
            "Do you miss the middle ages? Then this is the place for you. Experience what it's like to be a king or queen!",
        price: 3280,
    },
    {
        ownerId: 1,
        name: 'Château de Chambord',
        address: 'Château',
        city: 'Chambord',
        state: '41250',
        country: 'France',
        lat: 47.353048,
        lng: 1.481494,
        description:
            'Built in the 16th century, Château de Chambord is a stunning example of Renaissance architecture. The castle is quite large, completely surrounded by a moat, and is a former royal palace. ',
        price: 6850,
    },
    {
        ownerId: 1,
        name: 'Alnwick Castle',
        address: 'Alnwick',
        state: 'NE66 1NQ',
        city: 'Alnwick',
        country: 'UK',
        lat: 55.4158,
        lng: -1.7062,
        description:
            'Used as a filming location for the Harry Potter movies, this is a must see for any Harry Potter fan. It was built in the 11th century, making it one of the older castles in England.',
        price: 4580,
    },
];

// Spot Images
const spotImages = [
    {
        spotId: 1,
        url: 'ochre_court/preview.jpg',
        preview: true,
    },
    {
        spotId: 1,
        url: 'ochre_court/inside.jpg',
        preview: false,
    },
    {
        spotId: 2,
        url: 'windsor/preview.jpg',
        preview: true,
    },
    {
        spotId: 3,
        url: 'castelo_de_sao_jorge/preview.jpg',
        preview: true,
    },
    {
        spotId: 4,
        url: 'heidelberg/preview.jpg',
        preview: true,
    },
    {
        spotId: 5,
        url: 'pomeranian_dukes/preview.jpg',
        preview: true,
    },
    {
        spotId: 6,
        url: 'castelo_de_guimaraes/preview.jpg',
        preview: true,
    },
    {
        spotId: 7,
        url: 'chateau_chambord/preview.jpg',
        preview: true,
    },
    {
        spotId: 8,
        url: 'alnwick/preview.jpg',
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
