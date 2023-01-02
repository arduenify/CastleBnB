const { sequelize } = require('../db/models');

sequelize.showAllSchemas({ logging: true }).then(async (data) => {
    if (!data.includes('airbnb_clone')) {
        await sequelize.createSchema('airbnb_clone');
    }
});
