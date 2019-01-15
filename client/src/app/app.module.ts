import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppLoadModule } from './app-load/app-load.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import {
  HttpService, NlpService, LoggerService, SpeechRecognitionService,
  StorageAndUtilsService, WebsocketService, SafebrowsePipe
} from "./shared";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MessagetimeComponent } from './messagetime/messagetime.component';
import { HomeComponent } from './home/home.component';
import { ConversationComponent } from './conversation/conversation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MessagetimeComponent,
    HomeComponent,
    ConversationComponent,
    SafebrowsePipe
  ],
  imports: [
    BrowserModule,
    AppLoadModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    HttpService, NlpService, LoggerService, SpeechRecognitionService,
    StorageAndUtilsService, WebsocketService,
    { provide: LoggerService, useClass: LoggerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
