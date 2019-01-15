import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Doc } from "./doc";
import { GlobalConstants } from "./GlobalConstants";
import { environment } from '../../environments/environment';

@Injectable()
export class WebsocketService {

  constructor() { }
  ws: any = {};

  public initiateWebSocketComm() {
    return Observable.create(observer => {
      setTimeout(() => {

        this.ws = new WebSocket(GlobalConstants.dictAppSettingsMaster.getItem('URL_QLIKENGINE_WEBSOCKET'));

        this.ws.onopen = function () {
          console.log("opening web socket");
        }

        this.ws.onclose = function () {
          console.log("Closed Websocket");
        }

        this.ws.onerror = function (err) {
          console.log("Error on websocket", JSON.stringify(err));
        }

        setTimeout(() => {

          var openDoc = Doc.openDoc(GlobalConstants.dictAppSettingsMaster.getItem('APPID'), "", "")

          try {
            console.log("WebSocket State:- " + this.ws.readyState);

            this.ws.send(JSON.stringify(openDoc));

            if (this.ws.readyState == 1) { // Checking Sheet Level Access
              this.getAuthenticatedUSer();
            }

          } catch (error) {
            console.log("Error In sending Data on WebSocket");
          }

          this.ws.onmessage = function (evt: any) {
            // var d = JSON.parse(evt.data);
            // console.log("WS Response:- ", d);
            // if (evt.returnValue && d.result != null && d.result["qReturn"] != null && d.result["qReturn"]["qHandle"] != null) {
            //   GlobalConstants.docLevelMethodHandle = d.result["qReturn"]["qHandle"];
            //   console.log("Handle Retured By Qlik:- ", d.result["qReturn"]["qHandle"]);
            // } else if (d["result"] != null && d.result["qLayout"] != null && d.result.qLayout["ListObject1"]) {
            //   var allAllowedSheets = d.result.qLayout.ListObject1.qListObject.qDataPages[0].qMatrix;
            //   var allAllowedSheetNames = [];
            //   for (let i = 0; i < allAllowedSheets.length; i++) {
            //     for (let j = 0; j < allAllowedSheets[i].length; j++) {
            //       allAllowedSheetNames.push(allAllowedSheets[i][j].qText);
            //     }
            //   }

            //   var masterSheets = [];
            //   var filtered = [];
            //   var keys = Object.keys(environment.landingPageLinks);
            //   var finalMenu = {};

            //   for (let i = 0; i < keys.length; i++) {
            //     if (environment.landingPageLinks[keys[i]].sheetName == "")
            //       filtered.push(environment.landingPageLinks[keys[i]]);
            //     else
            //       masterSheets.push(environment.landingPageLinks[keys[i]].sheetName);
            //   }

            //   masterSheets = masterSheets.filter(x => x != "");
            //   masterSheets = masterSheets.map(function (x) { return x.toUpperCase() })
            //   var matchedSheetaNames = masterSheets.filter(x => allAllowedSheetNames.includes(x));

            //   console.log(allAllowedSheetNames);

            //   for (let j = 0; j < matchedSheetaNames.length; j++) {
            //     for (let k = 0; k < keys.length; k++) {
            //       if (environment.landingPageLinks[keys[k]].sheetName.toUpperCase() == matchedSheetaNames[j]) {
            //         filtered.push(environment.landingPageLinks[keys[k]]);
            //       }
            //     }
            //   }

            //   filtered = filtered.sort(function (a, b) { return a.nSequence - b.nSequence });

            //   for (let j = 0; j < filtered.length; j++) {
            //     filtered[j]["isActive"] = 1;
            //     finalMenu[filtered[j].name.toLowerCase().replace(/ /g, '')] = filtered[j];
            //   }

            //   environment.landingPageLinks = finalMenu;
            //   console.log("finalMenu:- ", finalMenu);
            //   localStorage.setItem("allAllowedSheetNames", JSON.stringify(allAllowedSheetNames));
            //   observer.next(finalMenu);

            // }
          }
        }, 3000);
      }, 2000);
    });
  }

  public closeWebSocket() {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log("closing opened websocket");
      this.ws.close();
    }
  }

  public secondLevelDocOpration(methodName, request) {
    this.ws.send(JSON.stringify(request));
  }

  public timer(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  async load() {
    for (let i = 0; i < GlobalConstants.arrSelectionConfig.length; i++) {
      this.secondLevelDocOpration("GetField", Doc.GetField('', GlobalConstants.arrSelectionConfig[i].fieldName));
      await this.timer(1000);
      this.secondLevelDocOpration("Select", Doc.Select(GlobalConstants.docLevelMethodHandle, GlobalConstants.arrSelectionConfig[i].fieldValue));
      await this.timer(500);
    }
  }


  public getAuthenticatedUSer() {
    setTimeout(() => {
      this.ws.send(JSON.stringify(Doc.sheetLevelAccess()));
    }, 2000);

    setTimeout(() => {
      this.ws.send(JSON.stringify(Doc.getLayout()));
    }, 2000);

    setTimeout(() => {
      this.load();
    }, 2000);
  }
}
