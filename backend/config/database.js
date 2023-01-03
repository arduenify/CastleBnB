const config = require('./index');

module.exports = {
    development: {
        storage: config.dbFile,
        dialect: 'sqlite',
        seederStorage: 'sequelize',
        logQueryParameters: true,
        typeValidation: true,
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        seederStorage: 'sequelize',
        schema: process.env.SCHEMA,
        searchPath: process.env.SCHEMA,

        dialectOptions: {
            prependSearchPath: true,
            ssl: {
                require: true,
                rejectUnauthorized: false,
                prependSearchPath: true,
            },
        },
        define: {
            schema: process.env.SCHEMA,
            searchPath: process.env.SCHEMA,
        },
    },
};
