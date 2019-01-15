import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, Response } from '@angular/http';
import { map } from "rxjs/operators";
import { HttpHeaders } from '@angular/common/http';
import { GlobalConstants, StorageAndUtilsService } from '.';

@Injectable()
export class HttpService {

  private baseUrl = "";

  constructor(private http: Http, private utilsService: StorageAndUtilsService) { }

  authenticateAD(username, password) {

    const headers = new Headers();
    headers.append("content-type", "application/json");
    const options = new RequestOptions({ headers: headers });
    var enc = this.utilsService.encryptWithAES("214333", "m&mprd@60");

    return this.http.post(GlobalConstants.dictAppSettingsMaster.getItem("URL_AD_LOGIN"), {
      "tokenid": enc
    }, options);
  }
  
  httpGet(url: string) {
    return this.http.get(url);
  }

  httpPost(url, body) {
    return this.http.post(url, body);
  }

  get(url: string) {
    return this.request(url, RequestMethod.Get);
  }

  post(url: string, body: Object) {
    return this.request(url, RequestMethod.Post, body);
  }

  put(url: string, body: Object) {
    return this.request(url, RequestMethod.Put, body);
  }

  delete(url: string) {
    return this.request(url, RequestMethod.Delete);
  }

  request(url: string, method: RequestMethod, body?: Object) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions = new RequestOptions({
      url: GlobalConstants.dictAppSettingsMaster.getItem("URL_BACKEND_SERVICE") + `${url}`,
      method: method,
      headers: headers
    });

    if (body) {
      requestOptions.body = body;
    }

    const request = new Request(requestOptions);

    return this.http.request(request)
      .pipe(map((res: Response) => res.json()));
  }
}
