import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-server-config',
  templateUrl: './server-config.component.html',
  styleUrls: ['./server-config.component.css']
})
export class ServerConfigComponent implements OnInit {

  displayDialogForAppconfig: boolean;
  selectedAppConfigRow: any;
  appConfigRows: any;
  appConfigCols: any;
  newAppConfig: boolean = false;

  @Input() role:any;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {

    this.appConfigCols = [
      { field: 'key', header: 'Key' },
      { field: 'value', header: 'Value' },
    ];
    this.initialize();
  }

  initialize() {
    this.sharedService.getMasterConfig().subscribe((config: any) => {
      this.appConfigRows = config.serverConfig.sort(function(a, b){
        if(a.key < b.key) { return -1; }
        if(a.key > b.key) { return 1; }
        return 0;
    });
    });
  }

  onRowSelectAppConfig(event) {
    this.selectedAppConfigRow = { ...event.data };
    this.displayDialogForAppconfig = true;
  }

  showDialogToAddAppConfig() {
    this.newAppConfig = true;
    this.selectedAppConfigRow = {};
    this.displayDialogForAppconfig = true;
  }

  appConfigSave() {
    if (this.newAppConfig) {
      // direct insert to mongoDb
      this.selectedAppConfigRow["opType"] = 1
      console.log("To Insert New Document:- ", this.selectedAppConfigRow);
    } else {
      // find index and update to mongodb
      this.selectedAppConfigRow["opType"] = 0
      console.log("To Update Document:- ", this.selectedAppConfigRow);
    }

    this.crudAndRefresh();
    
    this.displayDialogForAppconfig = false;
  }

  crudAndRefresh() {
    this.sharedService.saveOrUpdateServerConfig(this.selectedAppConfigRow).subscribe((d: any) => {
      this.initialize();
      console.log(" crudAndRefresh ", d);
    });
  }

  appConfigDelete() {
    this.selectedAppConfigRow["opType"] = -1;
    this.crudAndRefresh();
    this.selectedAppConfigRow = null;
    this.displayDialogForAppconfig = false;
    console.log("After Deleting");
  }

  appConfigCancel() {
    this.displayDialogForAppconfig = false;
  }


}
