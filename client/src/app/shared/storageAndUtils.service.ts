import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { GlobalConstants } from '.';

@Injectable()
export class StorageAndUtilsService {

  constructor() { }

  clearChatFlag: boolean = false;
  @Output() clearChatFlagChange: EventEmitter<boolean> = new EventEmitter();
  private subject = new Subject<any>();

  encryptWithAES(username, password) {
    var toBeEncryptedStr = "usr=" + username + "===pwd=" + password;
    var key = CryptoJS.enc.Utf8.parse(GlobalConstants.dictAppSettingsMaster.getItem("CONST_AES_KEY"));
    var iv = CryptoJS.enc.Utf8.parse(GlobalConstants.dictAppSettingsMaster.getItem("CONST_AES_IV"));
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(toBeEncryptedStr), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
    console.log('Encrypted  = ' + encrypted);

    return encrypted.toString();
  }


  getUserData(key: string) {
    if (localStorage.getItem(key) == null) {
      return null
    } else {
      return localStorage.getItem(key);
    }
  }

  saveUserdata(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  clearUserData() {
    localStorage.clear();
  }

  getCurrentTime() {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    var ampm = hours >= 12 ? 'PM' : 'AM';
    var hr = hours % 12;
    hr = hr ? hr : 12;
    var min = minutes < 10 ? '0' + minutes : minutes;
    var sec = seconds < 10 ? '0' + seconds : seconds;
    var strTime = hr + ':' + min + ':' + sec + ' ' + ampm;
    return strTime;
  }

  

  genrateSessionId() {
    var bits = 36;
    var len = 16;
    var outStr = "", newStr;
    while (outStr.length < len) {
      newStr = Math.random().toString(bits).slice(2);
      outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
  }

  getGreeting() {
    var hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
      return 'Good Morning';
    }
    else if (hour > +12 && hour < 18) {
      return 'Good Afternoon';
    }
    else {
      return 'Good Evening';
    }
  }

  getClearChat() {
    return this.subject.asObservable();
  }

  sendClearChat(shortType) {
      this.subject.next(shortType);
  }
}
