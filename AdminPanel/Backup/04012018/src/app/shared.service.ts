import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SharedService {

  constructor(private http: HttpClient) { }

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
    return this.http.post<any>('http://localhost:7000/saveOrUpdateAppConfig',body);
  }

  // all operations are like upsert only
  // if user clik new then it has to be insertOne operation

}
