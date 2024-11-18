import {Component, OnDestroy, OnInit} from '@angular/core';
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";
import {DataService} from "../../services/data.service";
import {SocketService} from "../../services/socket.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-cell-table',
  templateUrl: './cell-table.component.html',
  styleUrl: './cell-table.component.scss',
  providers: []
})

export class CellTableComponent implements OnInit, OnDestroy{

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
  liquidSheetName: string = ''
  id: number = 1

  messageSub: Subscription

  constructor(private hotRegisterer: HotTableRegisterer,
              private dataService: DataService,
              private socketService:SocketService) {

    this.messageSub = this.socketService.on('message').subscribe((resp) => {
        console.log(resp)
      })
    this.messageSub = this.socketService.on('titleChange').subscribe((resp) => {
      this.liquidSheetName = resp.title
    })

  }

  ngOnInit() {
    this.getSpreadSheet()
  }

  public nameChangeWs(event:string){
    this.socketService.sendMessage('titleChange', event)
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
    this.dataService.saveSpreadSheet(this.id, this.liquidSheetName, this.data).subscribe((resp:any) => {
      console.log(resp)
    })
  }

  //TODO change this to be dynamic instead of 1
  public getSpreadSheet(){
    this.dataService.getSpreadSheet(this.id).subscribe((resp:any) => {
      const hotInstance = this.hotRegisterer.getInstance(this.hotId);
      hotInstance.updateData(resp.data)
      this.data = hotInstance.getData()
      this.liquidSheetName = resp.liquidSheetName
    })
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }

}

interface Cell {
  x:string,
  y:number,
  data:string
}

interface SpreadSheet {

}
