import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from "../shared/GlobalConstants";
import { getAlphaMonth } from "../shared/utilities";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppLoadService {

  constructor(private httpClient: HttpClient) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(`initializeApp:: inside promise`);

      setTimeout(() => {
        console.log(`initializeApp:: inside setTimeout`);

        resolve();
      }, 1500);
    });
  }

  getSettings(): Promise<any> {

    const promise = this.httpClient.get('assets/appconfig.json')
      .toPromise()
      .then((settings: any) => {
        console.log(`Settings from file: `, settings);
        GlobalConstants.voices = settings.voices;
        GlobalConstants.selectedVoiceConfiguration = settings.selectedVoiceConfiguration;

        return settings;
      })
      .then((settings: any) => {
        this.httpClient.get(settings.serviceUrl + '/getConfigMaster').toPromise().then((appSettings: any) => {

          for (let i = 0; i < appSettings.appLevelConfig.length; i++) {
            GlobalConstants.dictAppSettingsMaster.add(appSettings.appLevelConfig[i].key, appSettings.appLevelConfig[i].value)
          }

          GlobalConstants.arrMenuLevelConfig = appSettings.menuLevelConfig;
          GlobalConstants.arrSelectionConfig = appSettings.selectionConfig;

          var m = new Date().getMonth() - 1;
          if (m == -1) {
            m = 11;
          }
          
          var actMonth = getAlphaMonth(m);
          var actYear = "F" + new Date().getFullYear().toString().split('').slice(2, 4).join('');

          for (let i = 0; i < GlobalConstants.arrSelectionConfig.length; i++) {
            if (GlobalConstants.arrSelectionConfig[i].fieldName == "Month") {
              GlobalConstants.arrSelectionConfig[i].fieldValue = actMonth;
            } else if (GlobalConstants.arrSelectionConfig[i].fieldName == "FY Year") {
              GlobalConstants.arrSelectionConfig[i].fieldValue = actYear;
            }
          }
         
          var firstLevelMenuData = appSettings.menuLevelConfig.filter(x => x.isLandingMenu == 1 && x.reqType == 1);
          var tempfirst = firstLevelMenuData[0].btns.split('|');
          for (let i = 0; i < tempfirst.length; i++) {
            var o = tempfirst[i].split('$');
            GlobalConstants.arrFirstLevelMenu.push({ fieldName: o[1], fieldValue: o[0] });
          }

          var secondLevelMenuData = appSettings.menuLevelConfig.filter(x => x.isLandingMenu == 2);
          var tempSecond = secondLevelMenuData[0].btns.split('|');
          for (let i = 0; i < tempSecond.length; i++) {
            var o = tempSecond[i].split('$');
            GlobalConstants.arrSecondLevelMenu.push({ name: o[1], strDim: o[0] });
          }

          var thirdLevelMenuData = appSettings.menuLevelConfig.filter(x => x.isLandingMenu == 3);
          var tempThird = thirdLevelMenuData[0].btns.split('|');
          for (let i = 0; i < tempThird.length; i++) {
            var o = tempThird[i].split('$');
            GlobalConstants.arrThirdLevelMenu.push({ name: o[0], strDim: o[1] });
          }

          console.log("environment.defaultSelections", GlobalConstants.arrSelectionConfig);
          console.log("GlobalConstants.arrFirstLevelMenu", GlobalConstants.arrFirstLevelMenu);
          console.log("GlobalConstants.arrSecondLevelMenu ", GlobalConstants.arrSecondLevelMenu);
          console.log("GlobalConstants.arrThirdLevelMenu ", GlobalConstants.arrThirdLevelMenu);

        });
      });

    return promise;
  }
}
