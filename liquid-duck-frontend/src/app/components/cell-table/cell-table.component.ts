import {Component, OnInit} from '@angular/core';
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-cell-table',
  templateUrl: './cell-table.component.html',
  styleUrl: './cell-table.component.scss',
  providers: []
})

export class CellTableComponent implements OnInit{

  gridSettings: Handsontable.GridSettings = {
    startCols:50,
    startRows:50,
    allowInsertRow: false,
    allowInsertColumn: false,
    allowRemoveRow: false,
    allowRemoveColumn: false,
    afterChange: this.updateSpreadSheet.bind(this)
  }

  hotId:string = 'hotInstance'
  data: any[] = []

  constructor(private hotRegisterer: HotTableRegisterer,
              private dataService: DataService) {

  }

  ngOnInit() {
  }

  public updateSpreadSheet(changes: any, source: string){
    console.log(changes)
    console.log(source)
    // if (source === 'edit' && changes) {
    //   changes.forEach(([row, prop, oldValue, newValue]: any) => {
    //
    //   });
    // }
  }

  public getTableData() {
    const hotInstance = this.hotRegisterer.getInstance(this.hotId);
    if (hotInstance) {
      this.data = hotInstance.getData()
      console.log(this.data); // Outputs the current table data
    }
  }

  public saveSpreadSheet(){
    this.getTableData()
    this.dataService.saveSpreadSheet(this.data).subscribe((resp:any) => {
      console.log(resp)
    })
  }

  //TODO change this to be dynamic instead of 1
  public getSpreadSheet(){
    this.dataService.getSpreadSheet(1).subscribe((resp:any) => {
      console.log(resp)
      // this.data = hotInstance
    })
  }
}

interface Cell {
  x:string,
  y:number,
  data:string
}

interface SpreadSheet {

}
