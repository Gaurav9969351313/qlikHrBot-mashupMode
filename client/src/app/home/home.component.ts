import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { NgbModal, NgbDropdownConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpService, WebsocketService, StorageAndUtilsService, LoggerService, GlobalConstants } from '../shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbDropdownConfig]

})
export class HomeComponent implements OnInit {

  showChatBotWrapper: boolean = false;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('chatWindow') private chatWindow: ElementRef;

  closeResult: string;
  expandFlag: boolean = false;

  contact: any = {
    "email": GlobalConstants.dictAppSettingsMaster.getItem("CONST_CONTACT_EMAIL")
  };

  constructor(private _location: Location,
    private actRoute: ActivatedRoute,
    private storageAndUtilsService: StorageAndUtilsService,
    private modalService: NgbModal,
    private config: NgbDropdownConfig,
    private httpService: HttpService,
    private wsService: WebsocketService,
    private loggerService: LoggerService) {
    try {

      config.placement = 'bottom-left';
      config.autoClose = false;

      this.actRoute.params.subscribe((params: any) => {
        this.showChatBotWrapper = params["openChat"];
      })
    } catch (error) {
      this.loggerService.log('error', "[Component] --> [] --> " + JSON.stringify(error));
    }
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((mailModel) => {

      this.httpService.httpPost("/sendmail", mailModel).subscribe((resMailSent) => {
        console.log("resMailSent", resMailSent);
      });

      this.closeResult = `Closed with: ${mailModel}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
     // this.scrollToBottom();
  }

  CloseChatBotWrapper() {
    this.wsService.closeWebSocket();
    this.showChatBotWrapper = false;
    this._location.back();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      this.loggerService.log('error', "[HomeComponent] --> [scrollToBottom()] --> " + JSON.stringify(err));
    }
  }

  clearChat() {
    try {
      this.storageAndUtilsService.sendClearChat("CC");
    } catch (error) {
      this.loggerService.log('error', "[HomeComponent] --> [clearChat()] --> " + JSON.stringify(error));
    }
  }

  openDialog() {
    console.log("Email Dialog Opened");
  }

  toggleExpand() {
    this.expandFlag = !this.expandFlag;
    console.log(this.expandFlag);
    if (this.expandFlag) {
      this.chatWindow.nativeElement.classList.remove("collapseChatWindow");
      this.chatWindow.nativeElement.classList.add("expandChatWindow");
    } else {
      this.chatWindow.nativeElement.classList.add("collapseChatWindow");
      this.chatWindow.nativeElement.classList.remove("expandChatWindow");
    }
  }
}
