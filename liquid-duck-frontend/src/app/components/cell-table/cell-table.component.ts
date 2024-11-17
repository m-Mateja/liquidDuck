import {Component, inject, OnInit} from '@angular/core';
import Handsontable from "handsontable";

@Component({
  selector: 'app-cell-table',
  templateUrl: './cell-table.component.html',
  styleUrl: './cell-table.component.scss'
})

export class CellTableComponent implements OnInit{

  gridSettings: Handsontable.GridSettings = {
    startCols:50,
    startRows:50
  }
  constructor() {

  }

  ngOnInit() {
  }
}

interface Cell {
  x:string,
  y:number,
  data:string
}
