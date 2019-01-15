const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const utils = require('../utilities/utils');

// Working
router.post('/pushToServerLog', function (req, res) {
    try {
        utils.log(req.body.type, JSON.stringify(req.body.logBody));
        res.send("ok");
    } catch (error) {
        utils.log('error', '/pushToServerLog Error While Logging');
    }
});

// Working
router.get('/ping', function (req, res) {
    try {
        utils.log('info', "Ping Called");
        res.send("Hii ... ");
    } catch (error) {
        utils.log('error', '/ping Error While Logging Log');
    }
});

module.exports = router