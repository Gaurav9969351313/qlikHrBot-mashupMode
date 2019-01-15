const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cronJob = require('./utilities/cronjobs');

const dao = require('./dao/dao');
const config = require('./config');
const utils = require('./utilities/utils');

const loginAPI = require('./routers/loginAPI');
const utilsAPI = require('./routers/utilsAPI');
const metaDataAPI = require('./routers/getMetaDataAPI');
const adminAPI = require('./routers/admin/adminRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer : true
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(loginAPI);
app.use(utilsAPI);
app.use(metaDataAPI);
app.use(adminAPI);

var Server = app.listen(config.SERVER_PORT, function () {
  utils.log('info','Generic Server Started');
  console.log('listen to port ' + config.SERVER_PORT);
});

// Automation Scripts
// Admin Routes
// Minimise the calls from admin
