import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CellTableComponent} from "./components/cell-table/cell-table.component";
import {HotTableModule} from "@handsontable/angular";
import {registerAllModules} from "handsontable/registry";
import {BrowserModule} from "@angular/platform-browser";

registerAllModules()

@NgModule({
  declarations: [
    DashboardComponent,
    CellTableComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HotTableModule
  ],
  providers: [],
  bootstrap: [
    DashboardComponent
  ]
})
export class AppModule { }
