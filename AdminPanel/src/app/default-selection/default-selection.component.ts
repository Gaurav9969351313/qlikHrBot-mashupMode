import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-default-selection',
  templateUrl: './default-selection.component.html',
  styleUrls: ['./default-selection.component.css']
})
export class DefaultSelectionComponent implements OnInit {

  displayDialogForAppconfig: boolean;
  selectedAppConfigRow: any;
  appConfigRows: any;
  appConfigCols: any;
  newAppConfig: boolean = false;

  @Input() role:any;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {

    this.appConfigCols = [
      { field: 'fieldName', header: 'Field Name' },
      { field: 'fieldValue', header: 'Field Value' },
    ];

    this.initialize();

  }

  initialize() {
    this.sharedService.getMasterConfig().subscribe((config: any) => {
      this.appConfigRows = config.selectionConfig;
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
    this.sharedService.saveOrUpdateDefaultSelections(this.selectedAppConfigRow).subscribe((d: any) => {
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
