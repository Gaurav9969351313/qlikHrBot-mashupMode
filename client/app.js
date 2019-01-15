var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);

var config = {
    host: window.location.hostname,
    prefix: prefix,
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
};

require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});

require(["js/qlik"], function (qlik) {
    qlik.setOnError(function (error) {
        $('#popupText').append(error.message + "<br>");
        $('#popup').fadeIn(1000);
    });
    $("#closePopup").click(function () {
        $('#popup').hide();
    });

    // Reaserch Starts


    localStorage.setItem("abc", "SSS");


    // Research ends

    var strMashupSettingUrl = "http://localhost:7000/getConfigMaster";

    var jqxhr = $.getJSON(strMashupSettingUrl, function (objMasupSettings) {

        return objMasupSettings;
    }).done(function (objMasupSettings) {
        console.log("objMasupSettings:", objMasupSettings["appLevelConfig"].filter(x => x.key == "APPID")[0].value);

        var app = qlik.openApp(objMasupSettings["appLevelConfig"].filter(x => x.key == "APPID")[0].value, config);

        app.getObject('CurrentSelections', 'CurrentSelections');

        // step 1: get Current Url
        var gSearchQuery = window.location.search;

        // step 2: get Parameters From Url
        var jsonReq = parse_query_string(gSearchQuery);
        console.log(jsonReq);

        // step 3: Decide Req type
        // reqType =1 --> Single Obj + Default Selection

        if (jsonReq["reqType"] == "0") {
            // Sheet Level Access
            var sheetList = [];

            app.createList({
                "qFrequencyMode": "V",
                "qDef": {
                    "qFieldDefs": ["ANAME"]
                },
                "qExpressions": [],
                "qInitialDataFetch": [{
                    "qHeight": 1000,
                    "qWidth": 1
                }],
                "qLibraryId": null
            }, function (reply) {
                $.each(reply.qListObject.qDataPages["0"].qMatrix, function (i, v) {
                    sheetList.push(v["0"].qText);
                });

                jsonReq["allAllowedSheetNames"] = sheetList;

                var strSheetAccessUrl = "http://localhost:7000/putAllowedSheets";

                var jqxhr = $.getJSON(strSheetAccessUrl, function (resp) {

                    return resp;
                }).done(function (resp) {

                })
                console.log("jsonReq", jsonReq);
            });


        } else if (jsonReq["reqType"] == "1") {

            console.log("Inside Req 1");
            var arrSelections = jsonReq["selReq"].split('|');

            // https://qsdev.mahindra.com/extensions/HR_Phase1_action/HR_Phase1_action.html?reqType=1&bDefaultSelFlag=1&objId=BZmLC&selReq=Month$DEC|Employee_Type$Officers|FY%20Year$F19
            var bCurrOrPrevFlag = objMasupSettings["appLevelConfig"].filter(x => x.key == "GLOBAL_CONST_CURR_YoM")[0].value;

            // bCurrOrPrevFlag == 1 --> Current
            // bCurrOrPrevFlag == 0 --> Current - 1
            if (bCurrOrPrevFlag == "1") {
                console.log("bCurrOrPrevFlag:- ", bCurrOrPrevFlag);

            } else {

                for (let i = 0; i < arrSelections.length; i++) {
                    var o = arrSelections[i].split('$');

                    var m = new Date().getMonth() - 1;
                    if (m == -1) {
                        m = 11;
                    }
                    var actMonth = getAlphaMonth(m);
                    var actYear = "F" + new Date().getFullYear().toString().split('').slice(2, 4).join('');
                    if (o[0] == "Month") {
                        arrSelections[i] = o[0] + '$' + actMonth;
                    } else if (o[0] == "FY Year") {
                        arrSelections[i] = o[0] + '$' + actYear;
                    }
                }
            }

            // clear all selections

            for (let i = 0; i < arrSelections.length; i++) {
                var o = arrSelections[i].split('$');
                app.field(o[0]).selectMatch(o[1], false);
            }

            console.log("arrSelections", arrSelections);
            $('#additionalObjectBinder').removeClass('addObjWrapper');
            // now bind object to front end
            app.getObject("mainObjBinder", jsonReq["objId"]);


        } else if (jsonReq["reqType"] == "2") {
            console.log("Inside Req 2");
            debugger;
            var arrAdditionalObj = jsonReq["strAddObj"].split('|');

            $.each(arrAdditionalObj, function (index, val) {
                index++;

                var div = $('<div/>', {
                    id: 'Obj' + index,
                    style: "height:200px; width:200px;",
                    objid: val
                }).appendTo('#additionalObjectBinder');
                div.promise().done(function (arg1) {
                    console.log('Div Object is', this.attr("objid"));
                    app.getObject('Obj' + index, this.attr("objid") + "");
                });
            });
            app.getObject('mainObjBinder', jsonReq["objId"])

            // here we want to bind multiple objects to front end

        } else if (jsonReq["reqType"] == "3") {
            console.log("Inside Req 3");
            $('#additionalObjectBinder').removeClass('addObjWrapper');
            // here on the fly objects creation Sector/Gender 
            // make chart using lib
            MakeChartOnFlyLib(app, "barchart", jsonReq["strDim"], jsonReq["strDim"], [jsonReq['strLibID']], jsonReq["strDim"], "mainObjBinder");

        } else if (jsonReq["reqType"] == "4") {
            $('#additionalObjectBinder').removeClass('addObjWrapper');
            console.log("Inside Req 4");
            var selection = jsonReq["selReq"].split('$');
            app.field(selection[0]).selectMatch(selection[1], false);
            app.getObject("mainObjBinder", jsonReq["objId"]);
        }

    })
});


function parse_query_string(query) {
    var query = query.replace('?', '');
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function getAlphaMonth(sMonth) {
    var sRetval = '';
    switch (sMonth) {
        case 0:
            sRetval = 'JAN';
            break;
        case 1:
            sRetval = 'FEB';
            break;
        case 2:
            sRetval = 'MAR';
            break;
        case 3:
            sRetval = 'APR';
            break;
        case 4:
            sRetval = 'MAY';
            break;
        case 5:
            sRetval = 'JUN';
            break;
        case 6:
            sRetval = 'JUL';
            break;
        case 7:
            sRetval = 'AUG';
            break;
        case 8:
            sRetval = 'SEP';
            break;
        case 9:
            sRetval = 'OCT';
            break;
        case 10:
            sRetval = 'NOV';
            break;
        case 11:
            sRetval = 'DEC';
            break;
    }
    return sRetval;
}


function MakeChartOnFlyLib(app, objType, objDim, objDimTitle, libIDarr, objTitle, ObjContainer) {
    console.log("MakeChartOnFlyLib--->", objType, objTitle);
    var libID = [];
    if (objType !== 'kpi') {
        libID.push({
            "qDef": {
                "qFieldDefs": [objDim],
                "qFieldLabels": [objDimTitle]
            },
            "qNullSuppression": true
        });

    }
    $.each(libIDarr, function (i, v) {
        i++;
        libID[i] = {
            "qLibraryId": v,
            "qType": "measure"
        };
    });
    console.log(libID);
    app.visualization.create(objType, libID, {
        "dataPoint": {
            "showLabels": true
        },
        "color": {
            "auto": true
        },
        "legend": {
            "show": true
        },
        "title": objTitle
    }).then(function (visual) {
        visual.show(ObjContainer);
        libID = [];
        console.log(visual);
		/*$("#exportChart").show().click(function() {
            exportChart(visual.model,false);
            console.log("Exporting");
        });
		$("#export_chart").show();
		*/
    });
}
