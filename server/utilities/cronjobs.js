const CronJob = require('cron').CronJob;
const request = require('request');
const utils = require('./utils');

console.log("Cron Job Imported Sucessfully...");

new CronJob("0 0 0 0 0", function() { 
    utils.log('info','caching API called');
  
    request.get("localhost:4000", function (error, response, body) {
      console.log("=================================================================================================");
      if (error) {
        utils.log('error|'+ JSON.stringify(error));     
      }
      
      if (response && response.statusCode == 200) {
        utils.log('info',' [' + utils.getCurrentTime() + "]: Sucessfully Cached App MetaData in Configured Caching Server")
          
          console.log("=================================================================================================");
      }
      
    });
  
  }, null, true, 'Asia/Calcutta');
  