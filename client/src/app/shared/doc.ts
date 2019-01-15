import { environment } from "../../environments/environment";
import { GlobalConstants } from ".";

export class Doc {
    public static docLevelMethodHandle = 0;
    // public static ws = GlobalConstants.objWss;

    constructor() {

    }

    public static genrateRandom() {
        var len = 10;
        var bits = bits || 16;
        var outStr = "", newStr;
        while (outStr.length < len) {
            newStr = Math.random().toString(bits).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
        }
        return outStr.toUpperCase();
    };
    
    //this.genrateRandom()
    public static sheetLevelAccess() {
        var sheetLevelAccessStep1 = {
            "handle": 1,
            "method": "CreateSessionObject",
            "params": {
                "qProp": {

                    "qInfo": {
                        "qId": "sheetlevelaccess",
                        "qType": "listbox"
                    },
                    "ListObject1": {
                        "qListObjectDef": {
                            "qDef": {
                                "qFieldDefs": [
                                    "ANAME"
                                ],
                                "qFieldLabels": [
                                    "ANAME"
                                ]
                            },
                            "qInitialDataFetch": [{
                                "qTop": 0,
                                "qLeft": 0,
                                "qHeight": 1000,
                                "qWidth": 1
                            }]
                        }
                    }


                }
            }
        }

        return sheetLevelAccessStep1;
    }

    public static getLayout() {
        var sheetLevelAccessStep2 = {
            "handle": 2,
            "method": "GetLayout",
            "params": {}
        }
        return sheetLevelAccessStep2;
    }


    public static openDoc(qDocName, qUserName, qPassword) {
        var openDoc = {
            "handle": -1,
            "method": "OpenDoc",
            "params": {
                "qDocName": qDocName,
                "qUserName": qUserName,
                "qPassword": qPassword,
                "qSerial": "",
                "qNoData": false
            }
        };
        return openDoc;
    }

    public static GetField(handle, qFieldName) {
        var qFieldSelect = {
            "handle": 1,
            "method": "GetField",
            "params": {
                "qFieldName": "[" + qFieldName + "]"
            }
        };
        return qFieldSelect;
    }

    public static Select(handle, fieldValue) {
        var selectReq = {
            "handle": GlobalConstants.docLevelMethodHandle,
            "method": "Select",
            "params": {
                "qMatch": fieldValue,
                "qSoftLock": false,
                "qExcludedValuesMode": 0
            }
        };
        return selectReq;
    }

    public static ClearAll() {
        var clearAllReq = {
            "handle": 1,
            "method": "ClearAll",
            "params": {
                "qLockedAlso": false,
                "qStateName": ""
            }
        };
        return clearAllReq;
    }
}
