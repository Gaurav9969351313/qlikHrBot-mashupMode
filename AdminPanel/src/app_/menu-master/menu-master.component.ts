import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { debug } from 'util';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.css']
})
export class MenuMasterComponent implements OnInit {

  wholeMetaData: any;

  displayDialogForMenuconfig: boolean;
  selectedMenuConfigRow: any;
  menuConfigRows: any;
  menuConfigCols: any;
  newMenuConfig: boolean = false;

  sheetData: any;
  sheetWiseObjects: any;

  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer'];


  constructor(private sharedService: SharedService) { }

  objectIdClicked(objId) {
    console.log(objId);
    var url = "http://qsdev.mahindra.com/single/?appid=d2d69372-0872-4319-ab68-e2784c2db879&obj=" + objId + "&opt=nointeraction&select=clearall";
    window.open(url, '_blank');
  }

  ngOnInit() {

    this.sharedService.getMetaDataFromRedis().subscribe((meta: any) => {

      this.wholeMetaData = JSON.parse(JSON.parse(meta["metaHashMap"]));
      this.sheetData = this.wholeMetaData.sheetwiseData; // SheetTitle sheetWiseObjects ObjectName

    })

    this.menuConfigCols = [
      { field: 'nSequence', header: 'Sequence', type: 'string' },
      { field: 'isLandingMenu', header: 'Menu Level', type: 'string' },
      { field: 'name', header: 'Name', type: 'string' },
      { field: 'reqType', header: 'Req. Type', type: 'string' },
      { field: 'sheetName', header: 'Sheet Name', type: 'string' },
      { field: 'objId', header: 'Object Id', type: 'url' },
      { field: 'strLibID', header: 'Lib Id', type: 'string' },
      // { field: 'btns', header: 'Buttons', type: 'string' },
      // { field: 'strSelections', header: 'selections', type: 'string' },
      // {  field: 'strAdditionalObjects', header: 'Additinal Objects', type: 'string' }
    ];

    this.initialize();
  }

  initialize() {
    this.sharedService.getMasterConfig().subscribe((config: any) => {
      this.menuConfigRows = config.menuLevelConfig.sort(function (a, b) { return a.nSequence - b.nSequence });;
    });
  }

  bindObjects() {
    this.sheetWiseObjects = [];
    var matchedSheet = this.sheetData.filter(x => x.SheetTitle == this.selectedMenuConfigRow.sheetName);
    if (matchedSheet.length > 0) {
      this.sheetWiseObjects = matchedSheet[0].sheetWiseObjects.map(x => x.ObjectName);
    } else {
      this.sheetWiseObjects = [];
    }
  }

  onRowSelectMenuConfig(event) {
    this.selectedMenuConfigRow = { ...event.data };
    this.bindObjects();
    this.displayDialogForMenuconfig = true;
  }

  onSheetNemeChange(sheetname) {
    console.log(sheetname);
    this.sheetWiseObjects = [];
    this.bindObjects();
  }

  showDialogToAddMenuConfig() {
    this.newMenuConfig = true;
    this.selectedMenuConfigRow = {};
    this.displayDialogForMenuconfig = true;
  }

  menuConfigSave() {
    this.selectedMenuConfigRow["isLandingMenu"] = Number(this.selectedMenuConfigRow["isLandingMenu"]);
    this.selectedMenuConfigRow["nSequence"] = Number(this.selectedMenuConfigRow["nSequence"]);
    this.selectedMenuConfigRow["isActive"] = Number(0);
    this.selectedMenuConfigRow["reqType"] = Number(this.selectedMenuConfigRow["reqType"]);
    if (this.newMenuConfig) {
      // direct insert to mongoDb
      this.selectedMenuConfigRow["opType"] = 1;
      console.log("To Insert New Document:- ", this.selectedMenuConfigRow);
    } else {
      // find index and update to mongodb
      this.selectedMenuConfigRow["opType"] = 0
      console.log("To Update Document:- ", this.selectedMenuConfigRow);
    }

    this.crudAndRefresh();

    this.displayDialogForMenuconfig = false;
  }

  crudAndRefresh() {
    this.sharedService.saveOrUpdateMenuConfig(this.selectedMenuConfigRow).subscribe((d: any) => {
      this.initialize();
      console.log(" crudAndRefresh ", d);
    });
  }

  menuConfigDelete() {
    this.selectedMenuConfigRow["opType"] = -1;
    this.crudAndRefresh();
    this.selectedMenuConfigRow = null;
    this.displayDialogForMenuconfig = false;
    console.log("After Deleting");
  }

  menuConfigCancel() {
    this.displayDialogForMenuconfig = false;
  }

}
