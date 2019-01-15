export interface AppLevelConstants {
    id?;
    key?;
    value?;
}

/*
=============================================================
show dbs
show collections;
use qlikHrChatBot
db.getCollectionInfos();
=============================================================
db.createCollection("config_AppLevel")
db.createCollection("config_FirstLevelMenu")
db.createCollection("config_DefaultSelections")

db.config_AppLevel.find({})
db.config_AppLevel.find({}).count();

db.config_FirstLevelMenu.find({})
db.config_FirstLevelMenu.find({}).count();

db.config_DefaultSelections.find({})
db.config_DefaultSelections.find({}).count();

db.config_AppLevel.insertMany([
    {"key":"URL_QLIK_AUTH","value":"http://localhost:7000/login"},
    {"key":"URL_LOGIN","value":"http://mmkndmoprd:8080/vms/login1"},
    {"key":"URL_CACHING","value":"http://localhost:7000/getWholeMetaData?forceFulRedisCacheUpdate=0"},    
    {"key":"URL_MAIL_SEND","value":"http://localhost:7000/sendmail"},
    {"key":"APPID","value":"d2d69372-0872-4319-ab68-e2784c2db879"},   
    {"key":"URL_RENDER_MULTIOBJ_MASHUP","value":"https://qsdev.mahindra.com/extensions/HR_Phase1/HR_Phase1.html"},
    {"key":"URL_QLIKENGINE_WEBSOCKET","value":"wss://qsdev.mahindra.com/app/d2d69372-0872-4319-ab68-e2784c2db879"},
    {"key":"CONST_AES_KEY","value":"M@h1ndra$1234567"},
    {"key":"CONST_AES_IV","value":"0001000100010001"},
    {"key":"MSG_CARD_HEADER","value":"UserId Might Be Wrong."},
    {"key":"MSG_LOGIN_ERROR","value":"User Logged In Sucessfully"},
    {"key":"MSG_LOGIN_SUCESS","value":"Hi {% username %}, How may I help you ?"},
    {"key":"MSG_CARD_HEADER_TEMP","value":"Please find below information for {% userIntent %} Number"},
    {"key":"URL_SERVER_LOGGING","value":"http://localhost:7000/pushToServerLog"}
  ]
);

db.config_FirstLevelMenu.insertMany([
   { "nSequence": 1, "isActive": 0, "name": "Head Count","reqType":"1", "sheetName": "Headcount Officers (Page 1)", "objId": "2d0143be-bc5a-446a-a125-a68af6bf927b", "btns": "Permanent|Probationer|Trainee|Contract|Others|OTP" },
   { "nSequence": 2, "isActive": 0, "name": "Attrition","reqType":"1", "sheetName": "Attrition Officers (Page 1)", "objId": "BZmLC" , "btns": "Permanent|Probationer|Trainee|Contract|Others|OTP" },
   { "nSequence": 3, "isActive": 0, "name": "New Joinee Report", "reqType":"2","sheetName": "Employee New Joinee Report","objId": "PUzNyUY|max","btns": ""}
 ] 
);

db.config_DefaultSelections.insertMany([
   { fieldName: "Month", fieldValue: "Dec" }, 
   { fieldName: "Employee_Type", fieldValue: "Officers" },
   { fieldName: "FY Year", fieldValue: "F19" }
])

*/