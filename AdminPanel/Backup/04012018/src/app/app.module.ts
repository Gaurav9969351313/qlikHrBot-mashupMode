import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';

import { PanelModule } from 'primeng/panel';
import { AppComponent } from './app.component';

import { SharedService } from "./shared.service";
import { ConfigMasterComponent } from './config-master/config-master.component';

@NgModule({
    declarations: [
        AppComponent,
        ConfigMasterComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TableModule,
        HttpClientModule,
        InputTextModule,
        DialogModule,
        ButtonModule,
        CarouselModule,
        PanelModule,
        AccordionModule
    ],
    providers: [SharedService],
    bootstrap: [AppComponent]
})
export class AppModule { }
