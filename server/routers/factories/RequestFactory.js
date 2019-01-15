var requestFactory = [
    {
        "Name": "fieldlistRequest",
        "RequestStruture"
            : {
                "qInfo": {
                    "qType": "FieldList"
                },
                "qFieldListDef": {
                    "qShowSystem": false,
                    "qShowHidden": false,
                    "qShowDerivedFields": true,
                    "qShowSemantic": true,
                    "qShowSrcTables": true,
                    "qShowImplicit": true
                }
            }
    },
    {
        "Name": "measureListRequest",
        "RequestStruture": {
            "qInfo": {
                "qType": "MeasureList"
            },
            "qMeasureListDef": {
                "qType": "measure",
                "qData": {
                    "title": "/qMetaDef/title",
                    "tags": "/qMetaDef/tags",
                    "Expression": "/qMeasure/qDef"
                }
            }
        }
    },
    {
        "Name": "dimensionListRequest",
        "RequestStruture": {
            "qInfo": {
                "qType": "DimensionList",
                "qId": ""
            },
            "qDimensionListDef": {
                "qType": "dimension",
                "qData": {
                    "title": "/qMetaDef/title",
                    "tags": "/qMetaDef/tags",
                    "grouping": "/qDim/qGrouping",
                    "info": "/qDimInfos"
                }
            }
        }
    },
    {
        "Name": "masterObjectRequest",
        "RequestStruture": {
            "qInfo": {
                "qType": "masterobject",
                "qId": ""
            },
            "qAppObjectListDef": {
                "qType": "masterobject",
                "qData": {
                    "name": "/metadata/name",
                    "visualization": "/visualization",
                    "tags": "/metadata/tags"
                }
            }
        }
    },
    {
        "Name": "variableListRequest",
        "RequestStruture": {
            "qInfo": {
                "qType": "VariableList",
                "qId": ""
            },
            "qVariableListDef": {
                "qType": "variable",
                "qData": {
                    "tags": "/tags"
                }
            }
        }
    },
    {
        "Name": "SheetListRequest",
        "RequestStruture": {
            "qInfo": {
                "qType": "SheetList"
            },
            "qAppObjectListDef": {
                "qType": "sheet",
                "qData": {
                    "title": "/qMetaDef/title",
                    "description": "/qMetaDef/description",
                    "cells": "/cells"
                }
            }
        }
    },
    {
        "Name": "getHyperCubeDataRegest",
        "RequestStruture": {
            "qPath": "/qHyperCubeDef",
            "qPages": [
                {
                    "qLeft": 0,
                    "qTop": 0,
                    "qWidth": 10,
                    "qHeight": 500
                }
            ]
        }
    },
    {
        "Name": "RequiredObjectList",
        "RequestStruture": {
            "ObjectList": ['barchart', 'combochart', 'table',
                'pivot-table', 'waterfallchart', 'treemap',
                'map', 'linechart', 'scatterplot', 'piechart',
                'gauge', 'histogram', 'distributionplot', 'boxplot',
                'kpi', 'text-image','anychart-qlik','amCombo'
            ]
        }

    }
]

function getRequestStructure(nameOfRequest) {
    // if not matched it will return -1 and array ka -1 index is undefind must be checked 
    return requestFactory[requestFactory.findIndex(x => x.Name === nameOfRequest)].RequestStruture;
}

module.exports = {
    getRequestStructure: getRequestStructure
}

