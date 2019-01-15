const persistanceLayer = require('../../dao/dao');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const utils = require('../../utilities/utils');

router.post('/loginForAdminPanel', function (req, res) {
    persistanceLayer.authenticateUserForAdminPanel(req.body, res);
});

router.get('/getConfigMaster', function (req, res) {
    persistanceLayer.getConfig(res);
});

router.post('/saveOrUpdateAppConfig', function (req, res) {
    persistanceLayer.saveOrUpdateAppConfig(req, res);
});

router.post('/saveOrUpdateServerConfig', function (req, res) {
    persistanceLayer.saveOrUpdateServerConfig(req, res);
});

router.post('/saveOrUpdateMenuConfig', function (req, res) {
    persistanceLayer.saveOrUpdateMenuConfig(req, res);
});

// router.post('/saveOrUpdateDefaultSelections', function (req, res) {
//     console.log(req.body);
//     const db = mongodClient.db(config.DB_NAME);

//     if (req.body.opType == 1) { // insert
//         db.collection('config_DefaultSelections').insertOne(req.body, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 res.send("0");
//             }
//             if (result)
//                 res.send("1");
//         })
//     } else if (req.body.opType == 0) { // update
//         db.collection('config_DefaultSelections').updateOne(
//             { "fieldName": req.body.fieldName }, { $set: { "fieldValue": req.body.fieldValue } },
//             function (err, result) {
//                 if (err) {
//                     console.log(err);
//                     res.send("0")
//                 }
//                 if (result)
//                     res.send("1");
//             });
//     } else if (req.body.opType == -1) { // delete
//         db.collection('config_DefaultSelections').removeOne(
//             { "fieldName": req.body.fieldName },
//             function (err, result) {
//                 if (err) {
//                     console.log(err);
//                     res.send("0")
//                 }
//                 if (result)
//                     res.send("1");
//             });
//     }
// });



module.exports = router
