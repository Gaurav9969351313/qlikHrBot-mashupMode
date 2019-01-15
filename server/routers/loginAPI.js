const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const schema = require('enigma.js/schemas/12.20.0.json');
const enigma = require('enigma.js');
var WebSocket = require('ws');
const nodemailer = require('nodemailer');
const QRS = require("./qrs");
const utils = require('../utilities/utils');
const RequestFactory = require('./factories/RequestFactory');
const dataFetcher = require('./DataFetcher');
const persistantLayer = require('../dao/dao');

const readCert = filename =>
    fs.readFileSync(path.resolve(__dirname, "certificates/", filename));

router.post('/login', function (req, res) {
    try {

        QRS.getTicket(req.body.username, function (err, ticket) {

            if (err) {
                utils.log('error', 'Error While generating Ticket');
                res.send(utils.ResponseToReturn(200, "Error", 0, { 'error': 'Error While generating Ticket' }));
            }
            else {
                utils.log('info', 'Ticket Genrated Sucessfully For User' + req.body.username);

                var bits = 36;
                var len = 16;
                var outStr = "", newStr;
                while (outStr.length < len) {
                    newStr = Math.random().toString(bits).slice(2);
                    outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
                }

                obj = {
                    "isNewSession": 1,
                    "ticketInfo": ticket,
                    "sessionId": outStr.toUpperCase(),
                    "arrAllowedSheets": []
                }

                const sessionPromise = new Promise((resolve, reject) => {
                    try {
                        const session = enigma.create({
                            schema,
                            proxy: utils.globalConstDict.getItem("URL_NETWORK_PROXY"),
                            url: utils.globalConstDict.getItem("URL_ENGIMA_WSS_CONNECTION") + '/' + utils.globalConstDict.getItem("QLIK_APPID"),

                            createSocket: url => new WebSocket(url, {
                                ca: [readCert('root.pem')],
                                key: readCert('client_key.pem'),
                                cert: readCert('client.pem'),
                                headers: {
                                    'X-Qlik-User': `UserDirectory=${encodeURIComponent(utils.globalConstDict.getItem("QLIK_USER_DIRECTORY"))}; UserId=${encodeURIComponent(req.body.username)}`
                                },
                            }),
                        });
                        resolve(session);
                    } catch (error) {
                        utils.log('error', 'error in getMetaDataAPI file while creating session');
                        return reject();
                    }

                });

                sessionPromise.then((session) => {
                    try {
                        session.open().then(async function (global) {


                            global.getDocList().then(function (docList) {
                                var appLevelAccessFlag = '0';
                                for (let i = 0; i < docList.length; i++) {
                                    const appId = docList[i].qDocId;
                                    if (appId == utils.globalConstDict.getItem("QLIK_APPID")) {
                                        appLevelAccessFlag = '1'
                                        break;
                                    } else {
                                        appLevelAccessFlag = '0'
                                    }
                                }

                                if (appLevelAccessFlag == '1') {
                                    console.log("Login Sucessful for (" + utils.globalConstDict.getItem("QLIK_APPID") + ") app");

                                    persistantLayer.persistSession(obj, "0");

                                    res.send(utils.ResponseToReturn(200, "Login & Ticket Generated Sucessfully", 1, obj));
                                } else {
                                    console.log("Login Failed (App Level Access is not Granted)");
                                    res.send(utils.ResponseToReturn(200, "Login Failed (App Level Access is not Granted Hence Login Failed)", 0, {}));
                                }
                            });
                        });
                    } catch (error) {
                        utils.log('error', 'Error While Opening Login Session')
                    }
                })
            }
        });
    } catch (error) {
        utils.log('error', 'Error While Making Session For Login API Endpoint');
    }

});


// to use this endpoint you have to make sure that you are not in mahindra network
// this works from open network
router.post('/sendmail', function (req, res) {
    try {
        var transporter = nodemailer.createTransport(
            {
                host: utils.globalConstDict.getItem("URL_MAIL_SERVER"),
                port: 25,
                secure: false,
                auth: {
                    user: utils.globalConstDict.getItem("MAIL_AUTH_USERNAME"),
                    pass: utils.globalConstDict.getItem("MAIL_AUTH_PASSWORD")
                }
            }
        );

        var mailOptions = {
            from: utils.globalConstDict.getItem("MAIL_APP_SUPPORT_FROM"),
            to: utils.globalConstDict.getItem("MAIL_APP_SUPPORT_TO"),
            subject: 'Sending Email using Node.js',
            text: 'sending mail  !',
        };

        mailOptions["text"] = "Greetings From Chatbot App Support";

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                utils.log('error', "Error While sending mail");
            } else {
                console.log('Email sent: ' + info.response);
                res.send(info.response);
            }
        });
    } catch (error) {
        utils.log('error', "Error While sending mail");
    }
});

router.post('/putAllowedSheets', function (req, res) {
    try {

        persistantLayer.persistSheetAccess(req.body, "0");
    } catch (error) {
        utils.log("error", "Error in /putAllowedSheets api call");
    }
});

router.post('/getAllowedSheets', function (req, res) {
    try {
        utils.log("info", "Inside getAllowedSheets");
        var valueToReturn = persistantLayer.getAllowedSheets(req.body, "0", res);
        
    } catch (error) {
        utils.log("error", "Error in /getAllowedSheets api call");
    }
})


module.exports = router