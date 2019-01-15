const localConfig = { 
    SERVER_PORT: 5100,

    MONGO_DB_URL: "mongodb://localhost:27017",
    MONGO_DB_NAME: "qlikHrChatBot",

    REDIS_DB_PORT: 6379,
    REDIS_DB_URL: "127.0.0.1",

    IS_DEBUG_MODE_ON: true
}

const prodConfig = { 
    SERVER_PORT: 5100,

    MONGO_DB_URL: "mongodb://localhost:27017",
    MONGO_DB_NAME: "qlikHrChatBot",

    REDIS_DB_PORT: 6379,
    REDIS_DB_URL: "127.0.0.1",

    IS_DEBUG_MODE_ON: true
}

const config = localConfig;

module.exports = config;