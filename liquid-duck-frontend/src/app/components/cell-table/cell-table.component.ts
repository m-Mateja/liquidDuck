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

  messageSub!: Subscription
  isUpdatingFromSocket: boolean = false

  constructor(private hotRegisterer: HotTableRegisterer,
              private dataService: DataService,
              private socketService:SocketService) {

    this.titleChangeSub()
    this.cellChangeSub()
  }

  ngOnInit() {
    this.getSpreadSheet()
  }

  private titleChangeSub(){
    this.messageSub = this.socketService.on('titleChange').subscribe((resp) => {
      this.liquidSheetName = resp.title
    })
  }

  private cellChangeSub(){
    this.messageSub = this.socketService.on('cellChange').subscribe((resp) => {
      const hotInstance = this.getHotInstance()
      this.isUpdatingFromSocket = true
      hotInstance.setDataAtRowProp(resp.row, resp.prop, resp.newValue, 'socket')
      this.isUpdatingFromSocket = false
      console.log('Received cellChange:', resp)
    })
  }

  public nameChangeWs(event:string){
    this.socketService.sendMessage('titleChange', event)
  }

  public updateSpreadSheet(changes: any){
    if(!this.isUpdatingFromSocket && changes !== null){
      changes.forEach((changeArr:any[]) => {
        this.socketService.sendMessage('cellChange', changeArr)
      })
    }
  }

  public getTableData() {
    const hotInstance = this.getHotInstance()
    if (hotInstance) {
      this.data = hotInstance.getData()
    }
  }

  public saveSpreadSheet(){
    this.getTableData()
    this.dataService.saveSpreadSheet(this.id, this.liquidSheetName, this.data).subscribe(() => {})
  }

  public getSpreadSheet(){
    this.dataService.getSpreadSheet(this.id).subscribe((resp:any) => {
      const hotInstance = this.getHotInstance()
      hotInstance.updateData(resp.data)
      this.data = hotInstance.getData()
      this.liquidSheetName = resp.liquidSheetName
    })
  }

  private getHotInstance(): Handsontable{
    return this.hotRegisterer.getInstance(this.hotId)
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
