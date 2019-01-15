import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from "./settings/settings";

@Injectable()
export class SharedService {

  constructor(private http: HttpClient) { }

  getMetaDataFromRedis() {
    return this.http.get<any>(APP_SETTINGS.serviceUrl + '/getWholeMetaData?forceFulDbCacheUpdate=0&dbChoice=0');
  }

  getMasterConfig() {
    return Observable.create(observer => {
      this.http.get<any>(APP_SETTINGS.serviceUrl+'/getConfigMaster')
        .toPromise()
        .then(res => res)
        .then(data => {
          console.log("Master Config Received:- ", data);
          observer.next(data)
        });
    })
  }

  saveOrUpdateAppConfig(body) {
    return this.http.post<any>(APP_SETTINGS.serviceUrl + '/saveOrUpdateAppConfig', body);
  }

  saveOrUpdateServerConfig(body) {
    return this.http.post<any>(APP_SETTINGS.serviceUrl + '/saveOrUpdateServerConfig', body);
  }

  saveOrUpdateMenuConfig(body) {
    return this.http.post<any>(APP_SETTINGS.serviceUrl + '/saveOrUpdateMenuConfig', body);
  }

  saveOrUpdateDefaultSelections(body) {
    return this.http.post<any>(APP_SETTINGS.serviceUrl + '/saveOrUpdateDefaultSelections', body);
  }

  post(url, body) {
    return this.http.post<any>(APP_SETTINGS.serviceUrl + url, body);
  }

  // all operations are like upsert only
  // if user clik new then it has to be insertOne operation

}
