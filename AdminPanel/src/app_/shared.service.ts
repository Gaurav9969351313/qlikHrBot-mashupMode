import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SharedService {

  constructor(private http: HttpClient) { }

  getMetaDataFromRedis() {
    return this.http.get<any>('http://localhost:7000/getWholeMetaData?forceFulDbCacheUpdate=0');
  }

  getMasterConfig() {
    return Observable.create(observer => {
      this.http.get<any>('http://localhost:7000/getConfigMaster')
        .toPromise()
        .then(res => res)
        .then(data => {
          console.log("Master Config Received:- ", data);
          observer.next(data)
        });
    })
  }

  saveOrUpdateAppConfig(body) {
    return this.http.post<any>('http://localhost:7000/saveOrUpdateAppConfig', body);
  }

  saveOrUpdateServerConfig(body) {
    return this.http.post<any>('http://localhost:7000/saveOrUpdateServerConfig', body);
  }

  saveOrUpdateMenuConfig(body) {
    return this.http.post<any>('http://localhost:7000/saveOrUpdateMenuConfig', body);
  }

  saveOrUpdateDefaultSelections(body) {
    return this.http.post<any>('http://localhost:7000/saveOrUpdateDefaultSelections', body);
  }

  // all operations are like upsert only
  // if user clik new then it has to be insertOne operation

}
