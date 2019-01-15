import { Injectable } from '@angular/core';
import { StorageAndUtilsService } from "./storageAndUtils.service";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";
import { GlobalConstants } from '.';

@Injectable()
export class NlpService {

  constructor(private storageAndUtilsService: StorageAndUtilsService, private httpService: HttpService) { }

  nlpRequest(body) {
    return this.httpService.httpPost(GlobalConstants.dictAppSettingsMaster.getItem("URL_NLP_SERVICE") + "/objectname", body)
  }
}
