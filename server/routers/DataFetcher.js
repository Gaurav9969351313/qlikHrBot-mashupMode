const utils = require('../utilities/utils');
const requestFactory = require('./factories/RequestFactory');
const db = require('../dao/dao');

var pAppDetails = (docMetadata) => new Promise((resolves) => {
    docMetadata.getAppLayout().then((AppDetails) => {

        objAppDetailFromAppLayout = {
            "strAppTitle": AppDetails.qTitle,
            "strLastReloadTime": AppDetails.qLastReloadTime,

            "MoneyFmt": AppDetails.qLocaleInfo.qMoneyFmt,
            "DecimalSep": AppDetails.qLocaleInfo.qDecimalSep,
            "ThousandSep": AppDetails.qLocaleInfo.qThousandSep,
            "ListSep": AppDetails.qLocaleInfo.qListSep,
            "MoneyDecimalSep": AppDetails.qLocaleInfo.qMoneyDecimalSep,
            "MoneyThousandSep": AppDetails.qLocaleInfo.qMoneyThousandSep,
            "CurrentYear": AppDetails.qLocaleInfo.qCurrentYear,

            "MoneyFmt": AppDetails.qLocaleInfo.qMoneyFmt,
            "TimeFmt": AppDetails.qLocaleInfo.qTimeFmt,
            "DateFmt": AppDetails.qLocaleInfo.qDateFmt,
            "TimestampFmt": AppDetails.qLocaleInfo.qTimestampFmt,
            "modifiedDate": AppDetails.modifiedDate,
            "FileSize": AppDetails.qFileSize
        };
        // console.log(AppDetails);
        resolves(objAppDetailFromAppLayout);
    });

}, (rejects) => {
    utils.log('error','error resolving promise pAppDetails')
});

// reqArrName ==> for error logging + return only req Data
var pCreateSessionObject = (docMetadata, request, reqArrName) => new Promise((resolves, rejects) => {
    docMetadata.createSessionObject(request)
        .then((listObject) => {
            return listObject;
        })
        .then((listObject) => {
            listObject.getLayout().then((list) => {
                // console.log(reqArrName, list);
                resolves(list[reqArrName].qItems);
            });
        });
}, (rejects) => {
    utils.log('error','error while resolving promise pCreateSessionObject ' + reqArrName)
});

var pSleeper = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms));

var pObjectData = (docMetadata, objectID) => new Promise((resolves, rejects) => {
    docMetadata.getObject(objectID).then((getObject) => {
        try {
            getObject.getProperties().then((objProperties) => {
                resolves(objProperties)
            });
        } catch (error) {
            utils.log('error','error while resolving promise pObjectData')
        }

    });
});

module.exports.getMetadataFromQlik = function (globalCon,dbChoice, res) {
    // All Global Level Objects Declarations

    var GlobalData = {
        syncTime: Date.now(),
        objAppDetails: {},
        arrFieldList: [],
        arrDimentionList: [],
        arrMesureList: [],
        arrAppObjectList: [],
        arrVariableList: [],
        sheetwiseData: []
    };


    globalCon.openDoc(utils.globalConstDict.getItem("QLIK_APPID"))
        .then((docMetadata) => {
            return docMetadata;
        })
        .then((docMetadata) => {

            pAppDetails(docMetadata).then((data) => {
                GlobalData.objAppDetails = data;
                // console.log("Data For AppDetails Received :- ", data);
            })

            pCreateSessionObject(docMetadata, requestFactory.getRequestStructure("fieldlistRequest"), "qFieldList").then((arrQFieldList) => {
                GlobalData.arrFieldList = arrQFieldList.map(a => a.qName);
                // console.log("arrFieldList", arrQFieldList);
            })

            pCreateSessionObject(docMetadata, requestFactory.getRequestStructure("measureListRequest"), "qMeasureList").then((arrQMeasureList) => {
                GlobalData.arrMesureList = arrQMeasureList.map(x =>{ return { "info":x.qInfo,"data": x.qData }});
            })

            pCreateSessionObject(docMetadata, requestFactory.getRequestStructure("dimensionListRequest"), "qDimensionList").then((arrQDimensionList) => {
                GlobalData.arrDimentionList = arrQDimensionList.map(x => { return { "info": x.qInfo, "title": x.qData.title } });
                // console.log("arrQDimensionList ", JSON.stringify(GlobalData.arrDimentionList));
            })

            pCreateSessionObject(docMetadata, requestFactory.getRequestStructure("masterObjectRequest"), "qAppObjectList").then((arrQAppObjectList) => {
                GlobalData.arrAppObjectList = arrQAppObjectList;
                // console.log("arrQAppObjectList ", JSON.stringify(GlobalData.arrAppObjectList));
            })

            pCreateSessionObject(docMetadata, requestFactory.getRequestStructure("variableListRequest"), "qVariableList").then((arrQVariableList) => {
                GlobalData.arrVariableList = arrQVariableList.map(x => {
                    return {
                        "varName": x.qName,
                        "varDefinition": x.qDefinition,
                        "varId": x.qInfo.qId,
                        "varType": x.qInfo.qType
                    }
                });
                // console.log("arrVariableList ", JSON.stringify(GlobalData.arrVariableList));
            })


            pCreateSessionObject(docMetadata, requestFactory.getRequestStructure("SheetListRequest"), "qAppObjectList").then((arrSheets) => {
                var sheetContainer = [];

                for (let i = 0; i < arrSheets.length; i++) {

                    var sheet = {
                        "SheetId": "",
                        "SheetTitle": "",
                        "objectCount": "",
                        "modifiedDate": "",
                        "sheetWiseObjects": [],
                        "objectCountReport": []
                    }

                    sheet.SheetId = arrSheets[i].qInfo.qId;
                    sheet.SheetTitle = arrSheets[i].qMeta.title;
                    sheet.modifiedDate = arrSheets[i].qMeta.modifiedDate;
                    sheet.objectCount = arrSheets[i].qData.cells.length;

                    for (let j = 0; j < arrSheets[i].qData.cells.length; j++) {

                       // if (requestFactory.getRequestStructure("RequiredObjectList").ObjectList.includes(arrSheets[i].qData.cells[j].type)) {
                            var sheetKeAnderKaObj = {
                                "ObjectName": arrSheets[i].qData.cells[j].name,
                                "ObjectType": arrSheets[i].qData.cells[j].type,
                                "ObjectMetaData": {
                                    "ObjectTitle": "",
                                    "ObjectSubTitle": "",
                                    "Mesures": [],
                                    "Dimentions": []
                                }
                            }
                            sheet.sheetWiseObjects.push(sheetKeAnderKaObj);
                       // }
                    } // inner for loop (sheet ke ander ke objects)
                    sheetContainer.push(sheet)
                } //outer for loop (sheet)

                console.log("=============================================================");
                var sheetsAll = sheetContainer;
                for (let i = 0; i < sheetsAll.length; i++) {

                    for (let j = 0; j < sheetsAll[i].sheetWiseObjects.length; j++) {

                        docMetadata.getObject(sheetsAll[i].sheetWiseObjects[j].ObjectName).then((getObject) => {

                            getObject.getProperties().then((Prop) => {
                                var dim = [], mes = [];
                                sheetsAll[i].sheetWiseObjects[j].ObjectMetaData.ObjectTitle = Prop.title;
                                sheetsAll[i].sheetWiseObjects[j].ObjectMetaData.ObjectSubTitle = Prop.subtitle;

                                if (Prop.qHyperCubeDef) {
                                    dim = (Prop.qHyperCubeDef.qDimensions["0"]) ? Prop.qHyperCubeDef.qDimensions : [];
                                    sheetsAll[i].sheetWiseObjects[j].ObjectMetaData.Dimentions = dim;
                                }
                                if (Prop.qHyperCubeDef) {
                                    mes = (Prop.qHyperCubeDef.qMeasures["0"]) ? Prop.qHyperCubeDef.qMeasures : [];
                                    sheetsAll[i].sheetWiseObjects[j].ObjectMetaData.Mesures = mes;
                                }

                                console.log("[" + i + "][" + j + "]========> Dimentions and Mesures Fitched [Sheet][Objects][M][D]");

                                if (i == sheetsAll.length - 1 && j == sheetsAll[i].sheetWiseObjects.length - 1) {
                                    console.log("sending Data");
                                    setTimeout(() => {
                                        setTimeout(() => {
                                            GlobalData.sheetwiseData = sheetsAll;
                                            //resolves(GlobalData);
                                            var finalOutput = JSON.stringify(GlobalData);
                                            db.insertMetaData(finalOutput,dbChoice);
                                            res.send(finalOutput);
                                        }, 3000);
                                    }, 2000);
                                }
                            });
                        });

                    }// sheetwise objects ka loop
                }//sheets ka loop
                console.log("=============================================================");
                // @_WorkingFine
            });

            // @_ToDo
            // Promise.all([objAppDetails]).then((data) => {
            //     console.log("Data For AppDetails Received :- ", data[0]);
            // });
        });
}
