import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CellTableComponent} from "./components/cell-table/cell-table.component";
import {HotTableModule, HotTableRegisterer} from "@handsontable/angular";
import {registerAllModules} from "handsontable/registry";
import {BrowserModule} from "@angular/platform-browser";
import {NavComponent} from "./components/nav/nav.component";
import {FormsModule} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HttpClient, HttpClientModule} from "@angular/common/http";

registerAllModules()

@NgModule({
  declarations: [
    DashboardComponent,
    CellTableComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HotTableModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [
    HotTableRegisterer
  ],
  bootstrap: [
    DashboardComponent
  ]
})
export class AppModule { }
