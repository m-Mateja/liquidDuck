import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CellTableComponent} from "./components/cell-table/cell-table.component";
import {HotTableModule, HotTableRegisterer} from "@handsontable/angular";
import {registerAllModules} from "handsontable/registry";
import {BrowserModule} from "@angular/platform-browser";
import {NavComponent} from "./components/nav/nav.component";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {provideAnimations} from "@angular/platform-browser/animations";

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
        HttpClientModule,
        MatInputModule
    ],
  providers: [
    HotTableRegisterer,
    provideAnimations()
  ],
  bootstrap: [
    DashboardComponent
  ]
})
export class AppModule { }
