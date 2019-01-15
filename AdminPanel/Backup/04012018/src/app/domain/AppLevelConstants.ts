export interface AppLevelConstants {
    id?;
    key?;
    value?;
}

/*
=============================================================
Backup Commands
---------------
mongoexport --db qlikHrChatBot --collection config_AppLevel --type=csv --fields key,value --out "D:\client_workspace\Mahindra\Qliksense-chatbot-production\AdminPanel\Backup\DbBackup\config_AppLevel.csv"
mongoexport --db qlikHrChatBot --collection config_FirstLevelMenu --type=csv --fields nSequence,isLandingMenu,isActive,name,reqType,sheetName,objId,strAdditionalObjects,strLibID,btns --out "D:\client_workspace\Mahindra\Qliksense-chatbot-production\AdminPanel\Backup\DbBackup\config_FirstLevelMenu.csv"

=============================================================
show dbs
show collections;
use qlikHrChatBot
db.getCollectionInfos();
=============================================================
Agregations
-----------
db.createCollection("config_AppLevel")
db.createCollection("config_FirstLevelMenu")
db.createCollection("config_DefaultSelections")
db.createCollection("config_Server")
db.createCollection("adminPanelUsers")


db.adminPanelUsers.insertMany([
  {"username":"gaurav","password":"mahindra@333", "role": "admin"},
  {"username":"talele","password":"mahindra@123", "role": "user"}
])


db.config_AppLevel.find({}).pretty();
db.config_FirstLevelMenu.find({}).pretty();
db.config_DefaultSelections.find({}).pretty();
==============================================================
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
   { "nSequence": 1, "isLandingMenu":1, "isActive": 0, "name": "Head Count","reqType":1, "sheetName": "Headcount Officers (Page 1)", "objId": "2d0143be-bc5a-446a-a125-a68af6bf927b", "btns": "Permanent|Probationer|Trainee|Contract|Others|OTP" },
   { "nSequence": 2, "isLandingMenu":1, "isActive": 0, "name": "Attrition","reqType":1, "sheetName": "Attrition Officers (Page 1)", "objId": "BZmLC" , "btns": "Permanent|Probationer|Trainee|Contract|Others|OTP" },
   { "nSequence": 3, "isLandingMenu":1, "isActive": 0, "name": "New Joinee Report", "reqType":2,"sheetName": "Employee New Joinee Report","objId": "PUzNyUY|max","btns": ""}
 ] 
);

db.config_Server.insertMany([
  {"key":"CONST_SERVER_PORT","value":3000},
  {"key":"CONST_SERVER_ISDEBUGMODEON","value":1 },
])

*/