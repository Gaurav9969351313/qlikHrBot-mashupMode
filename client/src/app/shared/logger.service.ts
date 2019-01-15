import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { environment } from '../../environments/environment';
export let isDebugMode = false;//environment.isDebugMode;
const noop = (): any => undefined;

@Injectable()
export class LoggerService {

  constructor(private httpService:HttpService) { }

  get info() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  log(type: string, args?: any): void {
    if (isDebugMode) {
      const logFn: Function = (console)[type] || console.log || noop;
      logFn.apply(console, [args]);
    }
    else {
      // if (type =='error') {
        this.httpService.post("/pushToServerLog",{"type":type,"logBody":args});  
      // }
    }
  }
}
