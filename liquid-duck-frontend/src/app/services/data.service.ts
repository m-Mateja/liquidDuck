import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  public saveSpreadSheet(data:any): Observable<any>{
    const body = {data:data}
    return this.http.post<any>(`${environment.liquidDuckBackend}/save/spread-sheet`,body)
  }
}
