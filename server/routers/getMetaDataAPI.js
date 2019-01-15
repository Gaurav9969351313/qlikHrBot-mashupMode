const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const schema = require('enigma.js/schemas/12.20.0.json');
const enigma = require('enigma.js');

const utils = require('../utilities/utils');
const dataFetcher = require('./DataFetcher');
const persistantLayer = require('../dao/dao');

const readCert = (filename) =>
    fs.readFileSync(path.resolve(__dirname, "certificates/", filename));

// http://localhost:5100/getWholeMetaData?forceFulDbCacheUpdate=0&dbChoice=0
// if 0 then get data from caching
// if 1 then get data from qlik server and overwrite fetched data into redis
router.get('/getWholeMetaData', function (req, res) {
    try {

        const sessionPromise = new Promise((resolve, reject) => {
            try {
                var url = utils.globalConstDict.getItem("URL_ENGIMA_WSS_CONNECTION") + '/' + utils.globalConstDict.getItem("QLIK_APPID");
                console.log(url);
                const session = enigma.create({
                    schema,
                    proxy: utils.globalConstDict.getItem("URL_NETWORK_PROXY"),
                    url: url,


                    createSocket: url => new WebSocket(url, {
                        ca: [readCert('root.pem')],
                        key: readCert('client_key.pem'),
                        cert: readCert('client.pem'),
                        headers: {
                            'X-Qlik-User': `UserDirectory=${encodeURIComponent(utils.globalConstDict.getItem("QLIK_USER_DIRECTORY"))}; UserId=${encodeURIComponent(utils.globalConstDict.getItem("CONST_MASTER_USERID"))}`
                        },
                    }),
                });
                resolve(session);
            } catch (error) {
                utils.log('error', 'error in getMetaDataAPI file while creating session');
                return reject();
            }

        });

        var forceCachingFlag;
        console.log("Fetching or Putting MetaData:- ", req.query.dbChoice);
        if (req.query.forceFulDbCacheUpdate == '0')
            forceCachingFlag = false;
        else if (req.query.forceFulDbCacheUpdate == '1')
            forceCachingFlag = true;

        if (!forceCachingFlag) {
            // get dara from DB
            var dataToReturn = persistantLayer.getDataFromCache(req.query.dbChoice, res);
        } else {
            // get data from Qlik
            try {
                sessionPromise.then((session) => {
                    session.open().then(async function (global) {
                        var resp = await dataFetcher.getMetadataFromQlik(global, req.query.dbChoice, res);
                        // res.send(resp);
                    });
                });
            } catch (error) {
                console.log('error while resolving');
            }
        }
    } catch (error) {
        utils.log('error', "Error while Fetching all Metadata");
    }
});

module.exports = router