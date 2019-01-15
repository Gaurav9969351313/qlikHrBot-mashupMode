import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { APP_SETTINGS } from '../settings';

@Injectable()
export class AppLoadService {

  constructor(private httpClient: HttpClient) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
          console.log(`initializeApp:: inside promise`);

          setTimeout(() => {
            console.log(`initializeApp:: inside setTimeout`);
            // doing something

            resolve();
          }, 1000);
        });
  }

  getSettings(): Promise<any> {
    console.log(`getSettings:: before http.get call`);
    
    const promise = this.httpClient.get('assets/appconfig.json')
      .toPromise()
      .then((settings:any) => {
        console.log(`Settings from API: `, settings);

        APP_SETTINGS.serviceUrl = settings.serviceUrl;

        console.log(`APP_SETTINGS: `, APP_SETTINGS);

        return settings;
      });

    return promise;
  }
}
