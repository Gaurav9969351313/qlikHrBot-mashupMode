import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router } from "@angular/router";
import { HttpService, StorageAndUtilsService, LoggerService } from '../shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showLogin: boolean = true;
  showConverSation: boolean = false;

  userModel: any = {};

  loginInfo = {};

  @ViewChild('loginHandle') loginHandle: ElementRef;

  constructor(private storageService: StorageAndUtilsService,
    private httpService: HttpService,
    private loggerService: LoggerService,
    private router: Router) { }

  ngOnInit() {

    try {
      this.showLogin = true;
      this.showConverSation = false;
      var storedData: any = JSON.parse(this.storageService.getUserData("jUserData"));
      if (storedData != null) {
        console.log("Stored Data");
        this.userModel.username = storedData.username;
        this.userModel.password = storedData.password;
        this.userModel.rememberMe = storedData.rememberMe;
      }
    } catch (error) {
      this.loggerService.log('error', "[LoginComponent] --> [ngOnInit()] --> " + JSON.stringify(error));
    }
  }

  ngOnChanges(change: any) {
    if (change != null) {
      console.log("In Login OnChanges", change);
    }
  }

  login() {
    try {
      if (this.userModel.rememberMe == true)
        this.storageService.saveUserdata("jUserData", this.userModel);

      // this.httpService.authenticateAD(this.userModel.username, this.userModel.password).subscribe((adData: any) => {
      //   console.log("adData:- ", adData);
      // })

      this.httpService.post("/login", {
        "username": this.userModel.username,
        "password": this.userModel.password
      }).subscribe((objData: any) => {
        if (objData.ResponseString == 1) {
          this.loginInfo = objData.ResponseObject;
          this.storageService.saveUserdata("jSession", objData);
          this.showLogin = false;
          this.showConverSation = true;
          this.loginHandle.nativeElement.offsetParent.lastChild.classList.add("shortWrapper");
        }

        else if (objData.ResponseString == 0) {
          alert("User Dont Have App Level Access...!!");
        }
        else {
          alert("Error...");
        }
      });
    } catch (error) {
      this.loggerService.log('error', "[LoginComponent] --> [login()] --> " + JSON.stringify(error));
    }
  }
}