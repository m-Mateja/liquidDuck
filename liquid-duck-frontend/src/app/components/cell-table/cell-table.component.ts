import {Component, OnDestroy, OnInit} from '@angular/core';
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";
import {DataService} from "../../services/data.service";
import {SocketService} from "../../services/socket.service";
import {interval, Subscription} from "rxjs";
import {HyperFormula} from "hyperformula";


/**
 * @Mateja Milovanovic
 * 11-08-2024
 * Table component with sheet name and save sheet button
 */
@Component({
  selector: 'app-cell-table',
  templateUrl: './cell-table.component.html',
  styleUrl: './cell-table.component.scss',
  providers: []
})

export class CellTableComponent implements OnInit, OnDestroy{

  /**
   * grid settings for handsontable
   * afterChange hook tracks any changes made to the grid. This is bound to the updateSpreadSheet method
   */
  gridSettings: Handsontable.GridSettings = {
    startCols:30,
    startRows:60,
    height:1200,
    width:1500,
    formulas: {
      engine: HyperFormula,
    },
    allowInsertRow: false,
    allowInsertColumn: false,
    allowRemoveRow: false,
    allowRemoveColumn: false,
    afterChange: this.updateSpreadSheet.bind(this)
  }


  /**
   * init configurations
   * hotId and hotInstance used to reference the table instance... not the name I would've chosen
   * id would be initialized to 0 here if we had more than one liquid sheet in the db
   */
  hotId:string = 'hotInstance'
  data: any[] = []
  liquidSheetName: string = ''
  newLiquidSheetName: string = ''
  selectedOption: any
  liquidSheets:any[] = []
  dataSources:string[] = ['loadData','updateData','socket']
  id: number = 1

  /**
   * websocket message subscription init
   * track when data should be updating from the websocket
   */
  messageSub!: Subscription
  isUpdatingFromSocket: boolean = false

  constructor(private hotRegisterer: HotTableRegisterer,
              private dataService: DataService,
              private socketService:SocketService) {

    this.titleChangeSub()
    this.cellChangeSub()
  }

  ngOnInit(): void {
  }

  /**
   * subscribe to title changes coming from the websocket
   * set the response to this.liquidSheetName, which is bound to the title attribute
   */
  private titleChangeSub(): void{
    this.messageSub = this.socketService.on('titleChange').subscribe((resp) => {
      const permission = this.conditionalWebSocketUpdates(resp.id)
      if(permission){
        this.liquidSheetName = resp.title
        this.selectedOption[1] = this.liquidSheetName
      }
    })
  }

  /**
   * subscribe to cell changes coming from the websocket
   * request the current instance of the table
   * flag updating from socket in order to pass in data
   * set value of the cell based on the resp values
   * flag stop updating from socket to prevent infinite loop
   */
  private cellChangeSub(): void{
    this.messageSub = this.socketService.on('cellChange').subscribe((resp) => {
      const permission = this.conditionalWebSocketUpdates(resp.id)
      if(permission){
        const hotInstance:Handsontable = this.getHotInstance()
        this.isUpdatingFromSocket = true
        hotInstance.setDataAtRowProp(resp.row, resp.prop, resp.newValue, 'socket')
        this.isUpdatingFromSocket = false
      }
    })
  }

  /**
   * send websocket message for a title change with the new string
   * bound to ngModelChange for continuous updates
   */
  public nameChangeWs(event:string): void{
    this.socketService.sendMessage('titleChange', [this.selectedOption[0],event])
  }

  /**
   * update cells on the table when there is a change detected
   * only send a cell change websocket message if there are no current updates from the websocket
   */
  public updateSpreadSheet(changes: any, source: any): void{
    if (!this.dataSources.includes(source)){
      this.saveSpreadSheet()
    }
    if(!this.isUpdatingFromSocket && changes !== null && this.selectedOption !== undefined){
      changes.forEach((changeArr:any[]) => {
        this.socketService.sendMessage('cellChange', [this.selectedOption[0],changeArr])
      })
    }
  }

  /**
   * get instance of the table
   * set bound this.data to the current table data
   */
  public getTableData(): void {
    const hotInstance:Handsontable = this.getHotInstance()
    if (hotInstance) {
      this.data = hotInstance.getData()
    }
  }

  /**
   * get current table data
   * API call to save the liquid sheet to the db with parameters
   */
  public saveSpreadSheet(): void{
    if(this.selectedOption !== undefined){
      this.getTableData()
      this.dataService.saveSpreadSheet(this.selectedOption[0], this.liquidSheetName, this.data).subscribe((resp:string) => {})
    }
  }

  /**
   * Save a new spreadsheet to the db
   * Increment id by 1 for the db storage
   * Take the id index from the last element in the list and add 1
   * Refresh the liquidSheets array
   */
  public saveNewSpreadSheet(): void{
    let newId:number = 0
    if(this.liquidSheets.length !== 0){
      newId = this.liquidSheets[this.liquidSheets.length - 1][0] + 1
    }
    this.getTableData()
    this.dataService.saveSpreadSheet(newId, this.newLiquidSheetName, this.data).subscribe((resp:string) => {
      this.liquidSheets = []
      this.getAllSpreadSheets()
    })
    this.newLiquidSheetName = ''
  }

  /**
   * On selection change from the dropdown menu, get data for the specific spreadsheet selected
   */
  public selectNewTableFromDropdown(liquidSheet:any){
    this.getSpreadSheet(liquidSheet[0])
  }

  /**
   * API call to get the current sheet from the db
   * get current table instance and update this.data from the resp
   */
  public getSpreadSheet(id:number): void{
    this.dataService.getSpreadSheet(id).subscribe((resp:any) => {
      const hotInstance:Handsontable = this.getHotInstance()
      hotInstance.updateData(resp.data)
      this.data = hotInstance.getData()
      this.liquidSheetName = resp.liquidSheetName
    })
  }

  /**
   * Get all existing spreadsheets from the db
   * Append all of the sheets to an array
   */
  public getAllSpreadSheets(): void{
    this.liquidSheets = []
    this.dataService.getAllSpreadSheets().subscribe((resp:any) => {
      if(resp.data.length > 0){
        resp.data.forEach((liquidSheet:any) => {
          this.liquidSheets.push(liquidSheet)
        })
      }
    })
  }

  /**
   * Get all spreadsheets on dropdown menu open
   */
  public sheetMenuOnOpen(){
    this.getAllSpreadSheets()
  }

  /**
   * Only apply websocket updates if a dropdown selection has already been made. If not, don't do anything since it can be handled by an api call
   */
  private conditionalWebSocketUpdates(incomingData:any): boolean{
    if(this.selectedOption !== undefined){
      return this.selectedOption[0] == incomingData
    }
    return false
  }

  /**
   * get the current table instance... again, super weird name for a good tool
   */
  private getHotInstance(): Handsontable{
    return this.hotRegisterer.getInstance(this.hotId)
  }

  /**
   * unsubscribe to websockets
   */
  ngOnDestroy(): void {
    this.messageSub.unsubscribe();
  }
}
