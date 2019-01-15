import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpService, StorageAndUtilsService, LoggerService, GlobalConstants } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private httpService: HttpService,
    private loggerService: LoggerService,
    private storageAndUtilsService: StorageAndUtilsService,
    private router: Router) {
  }


  ngOnInit() {
    try {
     
    } catch (error) {
      this.loggerService.log('error', "This is Error On Console");
    }
  }


  navigateToHome() {
    try {
      this.router.navigate(['/home', { openChat: 'true' }]);
    } catch (error) {
      this.loggerService.log('error', "[AppComponent] --> [navigateToHome] --> " + JSON.stringify(error));
    }
  }
}
