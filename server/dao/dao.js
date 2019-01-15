const redis = require('redis');
const MongoClient = require('mongodb').MongoClient;
const utils = require('../utilities/utils');
const config = require('../config');
// Maintaining The Global Connection Objcets And Their Statuses
var isRedisClientConnected = false, isMongoClientConnected = false, db;
var redisClient = {}, mongodClient = {};

try {
    MongoClient.connect(config.MONGO_DB_URL, { useNewUrlParser: true }, function (err, client) {
        utils.log('info', '=============> Mongo Server Connected Sucessfully <================');
        mongodClient = client;
        getServerConfig();
    });
} catch (error) {
    utils.log('error', '=============> Error While Connecting Mongo Server <================');
}

try {
    redisClient = redis.createClient(config.REDIS_DB_PORT, config.REDIS_DB_URL);
    redisClient.on('connect', function () {
        utils.log('info', '=============> Redis Server Connected Sucessfully <================');
    });
} catch (error) {
    utils.log('error', '=============> Error While Connecting Redis Server <================');
}

// Working
getServerConfig = function () {
    try {
        var db = mongodClient.db(config.MONGO_DB_NAME);
        var col = db.collection("config_Server");

        col.find({}).toArray(function (err, docs) {
            if (err) {
                utils.log('error', "Error while Getting Server Config ");
            }

            if (docs.length) {
                for (let i = 0; i < docs.length; i++) {
                    utils.globalConstDict.add(docs[i].key, docs[i].value)
                }
            }
            utils.log('info', JSON.stringify(utils.globalConstDict))
        });
    } catch (error) {
        utils.log('error', "Error while Getting Server Config");
    }
}

module.exports.getDataFromCache = function (dbChoice, res) {

    var selectdata = {};

    if (dbChoice == "0") {
        try {
            redisClient.exists("QlikMetaData", function (err, reply) {
                if (err) {
                    utils.log('error', 'Redis Error While Searching Key');
                }

                if (reply === 1) {
                    utils.log('info', "Redis Key Exists")
                    redisClient.hgetall("QlikMetaData", function (err, appMetaData) {
                        if (err) {
                            utils.log("error", "Error while fetching AppMetaData from Redis ", err);
                        } else {
                            selectdata = appMetaData;
                            utils.log("info", "Successfully Sent Cached MetaData from Redis CACHE");
                            res.send(appMetaData);
                        }
                    });
                }
            });
        } catch (error) {
            utils.log("error", "Error While Selecting Data from Redis");
        }
    } else if (dbChoice == "1") {
        try {
            // @_ToDo check
            var db = mongodClient.db(config.MONGO_DB_NAME);
            var col = db.collection("qlikData");

            col.find({}).toArray(function (err, docs) {
                if (err) {
                    utils.log('error', "error while fetching meta data from mongo DB");
                }
                else {
                    utils.log("info", "Successfully Sent Cached MetaData from MongoDB CACHE");
                    res.send(docs);
                }
            });

            // mongodClient.close();
        } catch (error) {
            utils.log("error", "Error While Selecting Data in Mongo")
        }
        return selectdata;
    }
}

module.exports.insertMetaData = function (data, dbchoice) {
    if (dbchoice == "0") {
        try {
            redisClient.hmset("QlikMetaData", { 'metaHashMap': JSON.stringify(data) });
            utils.log("info", "Sucessfully Cached Data in Redis");
        } catch (error) {
            utils.log("error", "Error While inserting Data in Redis")
        }
    } else if (dbchoice == "1") {
        try {
            const db = mongodClient.db(config.MONGO_DB_NAME);
            var col = db.collection("qlikData");

            col.insert(JSON.parse(data), function (result) {
                utils.log('info', 'Sucessfully Cached Data in MongoDB');
            });

        } catch (error) {
            utils.log("error", "Error While inserting Data in Mongo")
        }
    }
}

module.exports.persistSession = function (data, dbchoice) {
    if (data["isNewSession"] == "1") {
        redisClient.set(data.sessionId, JSON.stringify(data));
        // var db = mongodClient.db("qlikHrChatBot");
        // var col = db.collection("sessionMaster");

        // col.insertOne(req,
        //     function (err, result) {
        //         if (err) {
        //             console.log(err);
        //         }
        //         if (result)
        //             console.log("Sucess");
        //     });
    } else if (data["reqType"] == "0") {
        redisClient.set(data.sessionId, JSON.stringify(data["allAllowedSheetNames"]));
        // var db = mongodClient.db("qlikHrChatBot");
        // db.collection('sessionMaster').updateOne(
        //     { "sessionId": req.sessionId }, { $set: { "arrAllowedSheets": req["allAllowedSheetNames[]"] } },
        //     function (err, result) {
        //     })
    }
}

module.exports.persistSheetAccess = function (data, dbchoice) {
    try {
        redisClient.set(data.sessionId, JSON.stringify(data));
    } catch (error) {
        utils.log("error", "error while persisting sheet level access in Redis Server");
    }

}

module.exports.getAllowedSheets = function (data, dbchoice, res) {
    try {
        var a = redisClient.get(data.sessionId, function (err, reply) {
            res.send(utils.ResponseToReturn(200, "Sucessfully Fetched allowedSheets By sessionID", 1, reply));
            return reply;
        })
    } catch (error) {
        utils.log("error", "error while persisting sheet level access in Redis Server");
    }
}

module.exports.getConfig = async function (res) {
    try {
        var masterConfig = {
            appLevelConfig: {},
            menuLevelConfig: {},
            selectionConfig: {},
            serverConfig: {}
        };

        const db = mongodClient.db(config.MONGO_DB_NAME);

        await db.collection("config_AppLevel").find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err);
            }
            masterConfig.appLevelConfig = docs;
        });

        await db.collection("config_FirstLevelMenu").find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err);
            }
            masterConfig.menuLevelConfig = docs;
        })

        await db.collection("config_Server").find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err);
            }
            masterConfig.serverConfig = docs;
        })

        await db.collection("config_DefaultSelections").find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err);
            }
            masterConfig.selectionConfig = docs;
        });

        setTimeout(() => {
            res.send(masterConfig);
        }, 2000);

        return masterConfig;

    } catch (error) {
        console.log('error|Error While Fetching getAppLevelConfig from DB');
    }
}

module.exports.authenticateUserForAdminPanel = function (req, res) {
    console.log(req);
    const db = mongodClient.db(config.MONGO_DB_NAME);

    db.collection("adminPanelUsers").find({ username: req.username, password: req.password }).toArray(function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs.length > 0) {
            res.send(utils.ResponseToReturn(200, "Sucessfully loggedIn in Admin Panel", 1, docs));
        } else {
            res.send(utils.ResponseToReturn(200, "Unable to log in Admin Panel", 0, {}));
        }
    });
}

module.exports.saveOrUpdateAppConfig = function (req, res) {
    const db = mongodClient.db(config.MONGO_DB_NAME);

    if (req.body.opType == 1) { // insert
        db.collection('config_AppLevel').insertOne(req.body, function (err, result) {
            if (err) {
                console.log(err);
                res.send("0");
            }
            if (result)
                res.send("1");
        })
    } else if (req.body.opType == 0) { // update
        db.collection('config_AppLevel').updateOne(
            { "key": req.body.key }, { $set: { "value": req.body.value } },
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("0")
                }
                if (result)
                    res.send("1");
            });
    } else if (req.body.opType == -1) { // delete
        db.collection('config_AppLevel').removeOne(
            { "key": req.body.key },
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("0")
                }
                if (result)
                    res.send("1");
            });
    }
}

module.exports.saveOrUpdateServerConfig = function (req, res) {
    const db = mongodClient.db(config.MONGO_DB_NAME);

    if (req.body.opType == 1) { // insert
        db.collection('config_Server').insertOne(req.body, function (err, result) {
            if (err) {
                console.log(err);
                res.send("0");
            }
            if (result)
                res.send("1");
        })
    } else if (req.body.opType == 0) { // update
        db.collection('config_Server').updateOne(
            { "key": req.body.key }, { $set: { "value": req.body.value } },
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("0")
                }
                if (result)
                    res.send("1");
            });
    } else if (req.body.opType == -1) { // delete
        db.collection('config_Server').removeOne(
            { "key": req.body.key },
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("0")
                }
                if (result)
                    res.send("1");
            });
    }
}

module.exports.saveOrUpdateMenuConfig = function (req, res) {
    const db = mongodClient.db(config.MONGO_DB_NAME);

    if (req.body.opType == 1) { // insert
        db.collection('config_FirstLevelMenu').insertOne(req.body, function (err, result) {
            if (err) {
                console.log(err);
                res.send("0");
            }
            if (result)
                res.send("1");
        })
    } else if (req.body.opType == 0) { // update
        db.collection('config_FirstLevelMenu').updateOne(
            { "_id": req.body._id },
            {
                $set: {
                    "nSequence": req.body.nSequence,
                    "isLandingMenu": req.body.isLandingMenu,
                    "isActive": req.body.isActive,
                    "name": req.body.name,
                    "reqType": req.body.reqType,
                    "sheetName": req.body.sheetName,
                    "objId": req.body.objId,
                    "strLibID": req.body.strLibID,
                    "btns": req.body.btns,
                    "strSelections": req.body.strSelections,
                    "strAdditionalObjects": req.body.strAdditionalObjects
                }
            },
            { upsert: true },
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("0")
                }
                if (result)
                    res.send("1");
            });
    } else if (req.body.opType == -1) { // delete
        db.collection('config_FirstLevelMenu').removeOne(
            { "objId": req.body.objId, "name": req.body.name },
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("0")
                }
                if (result)
                    res.send("1");
            });
    }
}