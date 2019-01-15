import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppLoadModule } from './app-load/app-load.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';

import { Routes, RouterModule } from '@angular/router';

import { PanelModule } from 'primeng/panel';
import { AppComponent } from './app.component';

import { SharedService } from "./shared.service";
import { ConfigMasterComponent } from './config-master/config-master.component';
import { MenuMasterComponent } from './menu-master/menu-master.component';
import { DefaultSelectionComponent } from './default-selection/default-selection.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { ServerConfigComponent } from './server-config/server-config.component';

const appRoutes: Routes = [ 
    { path: '**', redirectTo: '' }
];


@NgModule({
  declarations: [
    AppComponent,
    ConfigMasterComponent,
    MenuMasterComponent,
    DefaultSelectionComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ServerConfigComponent
  ],
  imports: [
    BrowserModule,
    AppLoadModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    HttpClientModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    CarouselModule,
    BrowserAnimationsModule,
    PanelModule,
    AccordionModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
