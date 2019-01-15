import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import {
  SpeechRecognitionService, StorageAndUtilsService, HttpService, LoggerService,
  WebsocketService, SafebrowsePipe, GlobalConstants
} from '../shared';
import { Doc } from '../shared/doc';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnChanges {
  @Input() loggedInUser: any;
  @ViewChild('results') results: any;

  qTicket: string = "";
  userName: string = "";

  arrConversation = [];
  allowedSheets: any;

  messageDialogModel: any = {};

  dictLandingPageLinks = [];
  dictLandingPageLinksWithURLS = [];

  showAll: boolean = false;
  cardHeader: any = "";

  nlpResponse: any;
  sendLoginNotificationFlag = 1;

  gSessionID: any;
  filteredLandingMenu: any;

  constructor(private httpService: HttpService,
    private websocket: WebsocketService,
    private loggerService: LoggerService,
    private speechRecognitionService: SpeechRecognitionService,
    private storageAndUtilsService: StorageAndUtilsService) { }

  ngOnInit() {
    this.dictLandingPageLinks = [];
    this.dictLandingPageLinksWithURLS = [];

    this.speechRecognitionService.speak("Welcome to Human Resourses ChatBot");

    this.gSessionID = JSON.parse(localStorage.getItem("jSession")).ResponseObject.sessionId;
    // this.userName = JSON.parse(localStorage.getItem("jUserData")).username;

    this.filteredLandingMenu = GlobalConstants.arrMenuLevelConfig.filter(x => x.isLandingMenu == 1);
    // this.dictLandingPageLinks = this.filteredLandingMenu.sort(function (a, b) { return a.nSequence - b.nSequence });
    this.arrConversation = this.initConversation();

    console.log("Menu Final:- ", GlobalConstants.arrMenuLevelConfig);

    this.showMoreOrLessLandingPageLinks();
    this.storageAndUtilsService.getClearChat().subscribe((d) => {
      console.log("Trigger captured in conversation", d);
      if (d == "CC") {
        this.arrConversation = [];
        this.arrConversation = this.initConversation();
      }
    });

  }

  landingPageLinkClicked(landingPageLinkObj: any) {

    this.storageAndUtilsService.saveUserdata("objPrimaryContext", landingPageLinkObj);

    var key = landingPageLinkObj.name.replace(/\s+/g, "").toLowerCase();
    console.log(key);
    this.cardHeader = GlobalConstants.dictAppSettingsMaster.getItem("MSG_CARD_HEADER").replace('{% intent %}', landingPageLinkObj.name);
    this.createConversation(landingPageLinkObj);

  }

  createConversation(landingPageLinkObj) {

    var url = "";
    console.log("inside getSingleConfigratorURL:- ", landingPageLinkObj);
    if (landingPageLinkObj.reqType == 1) {

      // https://qsdev.mahindra.com/extensions/HR_Phase1_action/HR_Phase1_action.html
      // ?reqType=1&bDefaultSelFlag=1&objId=BZmLC&selReq=Month$FEB|Employee_Type$Officers|FY%20Year$F19

      console.log("Single Configurator only passing Object id");

      this.arrConversation.push({
        type: "iframewithbuttons",
        cardHeader: this.cardHeader,
        btnsData: GlobalConstants.arrFirstLevelMenu.map(x => x.fieldValue),
        url: this.getBindingUrl(landingPageLinkObj),
        isBookMarked: false
      });

      this.loggerService.log('info', url);
    }
    else if (landingPageLinkObj.reqType == 2) {
      // Reports
      // ?reqType=2&objId=max&strAdditionalObjects=PUzNyUY|TauKNBw

      this.arrConversation.push({
        type: "iframe",
        cardHeader: this.cardHeader,
        url: this.getBindingUrl(landingPageLinkObj),
        isBookMarked: false
      });
      this.loggerService.log('info', url);
    }
  }

  btnClicked(btnName: any = "") {

    console.log(btnName);
    var landingObj = JSON.parse(localStorage.getItem("objPrimaryContext"));
    var objId = landingObj.objId;

    if (GlobalConstants.arrFirstLevelMenu.map(x => x.fieldValue).includes(btnName)) {
      // ?reqType=4&objId=max&strFieldName=EmployeeCategory&strFieldValue=Permanant

      landingObj["reqType"] = 4;
      landingObj["objId"] = objId;

      this.arrConversation.push({
        type: "iframewithbuttons",
        cardHeader: this.cardHeader,
        btnsData: GlobalConstants.arrSecondLevelMenu.map(x => x.name),
        url: this.getBindingUrl(landingObj, btnName),
        isBookMarked: false
      });

    } else if (GlobalConstants.arrSecondLevelMenu.map(x => x.name).includes(btnName)) {

      landingObj["reqType"] = 3;
      landingObj["objId"] = objId;

      //?reqType=3&strLibID=pkhxzd&strDim=Sector
      this.arrConversation.push({
        type: "iframewithbuttons",
        cardHeader: this.cardHeader,
        btnsData: GlobalConstants.arrThirdLevelMenu.map(x => x.name),
        url: this.getBindingUrl(landingObj, btnName),
        isBookMarked: false
      });
    } else if (GlobalConstants.arrThirdLevelMenu.map(x => x.name).includes(btnName)) {

      landingObj["reqType"] = 3;
      landingObj["objId"] = objId;
      //?reqType=3&strLibID=pkhxzd&strDim=Tenure_Group

      this.arrConversation.push({
        type: "iframe",
        cardHeader: this.cardHeader,
        url: this.getBindingUrl(landingObj, btnName),
        isBookMarked: false
      });
    }
  }

  getBindingUrl(landingPageLinkObj, btnName = null) {

    var url = GlobalConstants.dictAppSettingsMaster.getItem("URL_COMMANDER_MASHUP")
      + "reqType=" + landingPageLinkObj["reqType"]
      + "&objId=" + landingPageLinkObj["objId"];

    if (landingPageLinkObj["reqType"] == 1) {

      url = url + "&selReq=" + landingPageLinkObj["strSelections"]
        + "&strAddObj=" + landingPageLinkObj["strAdditionalObjects"];

    } else if (landingPageLinkObj["reqType"] == 2) {
      url = url + "&selReq=" + landingPageLinkObj["strSelections"]
        + "&strAddObj=" + landingPageLinkObj["strAdditionalObjects"];
    }
    else if (landingPageLinkObj["reqType"] == 3) {
      var btnAttr = GlobalConstants.arrSecondLevelMenu.filter(x => x.name == btnName)[0];
      if (btnAttr == undefined) {
        btnAttr = GlobalConstants.arrThirdLevelMenu.filter(x => x.name == btnName)[0];
      }
      url = url + "&strLibID=" + landingPageLinkObj["strLibID"] + "&strDim=" + btnAttr.strDim;
    }
    else if (landingPageLinkObj["reqType"] == 4) {
      var btnAttr = GlobalConstants.arrFirstLevelMenu.filter(x => x.fieldValue == btnName)[0];
      url = url + "&selReq=" + btnAttr.fieldName + '$' + btnAttr.fieldValue;
    }

    console.log("getBindingUrl " + landingPageLinkObj["reqType"], url);
    return url;

  }

  sendMessage() {
    try {
      console.log("User Asked:- ", this.messageDialogModel.dialog);

      if (this.sendLoginNotificationFlag) {
        var pyReq = {
          strUserId: this.userName,
          strSessionId: this.gSessionID,
          arrAllowedSheets: JSON.parse(localStorage.getItem("allAllowedSheetNames"))
        };

        this.loggerService.log('info', this.messageDialogModel.dialog);

        console.log("sending login Notification to Python Service pyreq ", pyReq);
        this.httpService.httpPost(GlobalConstants.dictAppSettingsMaster.getItem("URL_NLP_SERVICE"),
          { "text": this.messageDialogModel.dialog }).subscribe((data: any) => {

            this.loggerService.log('info', data._body);
            var resFromNlp = JSON.parse(data._body);
            console.log("Nlp Service Response:--------- ", resFromNlp);
            this.createConversationFromNLP(resFromNlp);
            // this.sendLoginNotificationFlag = 0;
          });
      }

      this.arrConversation.push(
        { type: 'userMsg', text: this.messageDialogModel.dialog });


    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [sendMessage()] --> " + JSON.stringify(error));
    }
  }

  createConversationFromNLP(resFromNlp) {
    if (resFromNlp["reqType"] == "4") {
      this.arrConversation.push({
        type: "iframewithbuttons",
        cardHeader: this.cardHeader,
        btnsData: GlobalConstants.arrSecondLevelMenu.map(x => x.name),
        url: this.getBindingUrlForNlp(resFromNlp),
        isBookMarked: false
      });
    } else if (resFromNlp["reqType"] == "3") {
      this.arrConversation.push({
        type: "iframewithbuttons",
        cardHeader: this.cardHeader,
        btnsData: GlobalConstants.arrThirdLevelMenu.map(x => x.name),
        url: this.getBindingUrlForNlp(resFromNlp),
        isBookMarked: false
      });
    } else if (resFromNlp["reqType"] == "2") {

    } else if (resFromNlp["reqType"] == "1") {
      resFromNlp["strSelections"] = "Month$FEB|Employee_Type$Officers|FY%20Year$F19";
      this.arrConversation.push({
        type: "iframewithbuttons",
        cardHeader: this.cardHeader,
        btnsData: GlobalConstants.arrFirstLevelMenu.map(x => x.fieldValue),
        url: this.getBindingUrl(resFromNlp),
        isBookMarked: false
      });
    }
  }

  getBindingUrlForNlp(resFromNlp) {
    var url = GlobalConstants.dictAppSettingsMaster.getItem("URL_COMMANDER_MASHUP")
      + "reqType=" + resFromNlp["reqType"]
      + "&objId=" + resFromNlp["objId"];
    if (resFromNlp["reqType"] == "4") {
      url = url + "&selReq=" + resFromNlp["strSelections"];
    } else if (resFromNlp["reqType"] == "3") {
      url = url + "&strLibID=" + resFromNlp["strLibID"] + "&strDim=" + resFromNlp["strDim"];
    } else if (resFromNlp["reqType"] == "2") {
      url = url + "&selReq=" + resFromNlp["strSelections"]
        + "&strAddObj=" + resFromNlp["strAdditionalObjects"];
    }
    return url;
  }

  ngOnChanges(change: any) {
    try {
      this.qTicket = change.loggedInUser.currentValue.ticketInfo.Ticket;
      this.userName = change.loggedInUser.currentValue.ticketInfo.UserId;
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [ngOnChanges()] --> " + JSON.stringify(error));
    }
  }

  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  initConversation() {
    var a = [
      { type: "hiddeniframe", url: GlobalConstants.dictAppSettingsMaster.getItem("URL_COMMANDER_MASHUP") + "reqType=0&sessionId=" + this.gSessionID + "&qlikTicket=" + this.qTicket + "&username=" + this.userName },
      { type: 'landingCard', text: "Welcome" },
    ];
    // { type: "hiddeniframe", url: GlobalConstants.dictAppSettingsMaster.getItem("URL_DEV_HUB").replace('{% qTicket %}', this.qTicket) }
    setTimeout(() => {
      this.getSheetLevelAccess();
    }, 3000);
    return a;
  }
  getSheetLevelAccess() {
    setTimeout(() => {
      this.httpService.post("/getAllowedSheets", { "sessionId": this.gSessionID }).subscribe((d: any) => {
        if (d.ResponseString == 1) {
          var allowedSheets = JSON.parse(d.ResponseObject)["allAllowedSheetNames[]"];
          var allsheets = this.filteredLandingMenu.map(x => x.sheetName.toUpperCase());
          this.allowedSheets = allowedSheets.filter(value => -1 !== allsheets.indexOf(value));
          // this.dictLandingPageLinks = this.filteredLandingMenu.filter(x=>this.allowedSheets.includes( x.sheetName)).sort(function (a, b) { return a.nSequence - b.nSequence })
          for (let i = 0; i < this.allowedSheets.length; i++) {
            const sheetName = this.allowedSheets[i];
            if (allsheets.includes(sheetName)) {
              this.dictLandingPageLinks.push(this.filteredLandingMenu[allsheets.findIndex(x => x === sheetName)]);
            }
          }
          this.dictLandingPageLinks.sort(function (a, b) { return a.nSequence - b.nSequence });
          this.showMoreOrLessLandingPageLinks()

        } else {
            console.log("Sheet Level Access Not executed | Session Is not found in redis DB");
        }
      });
    }, 5000);
  }

  toggle() {
    try {
      this.showAll = !this.showAll;
      this.showMoreOrLessLandingPageLinks();
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [toggle()] --> " + JSON.stringify(error));
    }
  }

  showMoreOrLessLandingPageLinks() {
    // this.showAll = !this.showAll;
    try {
      if (this.showAll) {
        this.dictLandingPageLinksWithURLS = [];
        this.dictLandingPageLinksWithURLS = this.dictLandingPageLinks;
      } else {
        this.dictLandingPageLinksWithURLS = [];
        this.dictLandingPageLinksWithURLS = this.dictLandingPageLinks.slice(0, 3);
      }
    } catch (error) {
      this.loggerService.log('error', "[ConverstaionComponent] --> [showMoreOrLessLandingPageLinks()] --> " + JSON.stringify(error));
    }
  }

  starRecording(): void {
    this.speechRecognitionService.record()
      .subscribe(
        (value) => {
          // console.log(value);
          this.messageDialogModel.dialog = value;
        },
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            this.starRecording();
          }
        },
        () => {
          this.starRecording();
        });
  }

  bookmarkThis(i, conv) {
    // console.log(i, conv);
    this.arrConversation[i].isBookMarked = !this.arrConversation[i].isBookMarked;
  }

  saveBookmark(profileName) {
    var arrProfiles = [];
    var profile = {
      "profileName": "",
      "profileData": []
    };
    profile.profileName = profileName;
    profile.profileData = this.arrConversation.filter(x => x.isBookMarked == true);

    arrProfiles.push(profile);
    localStorage.setItem("profiles", JSON.stringify(arrProfiles));
  }
}
