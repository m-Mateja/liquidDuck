import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environment";
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  public saveSpreadSheet(id:number, name:string, data:any): Observable<string>{
    const body = {
      id:id,
      name:name,
      data:data
    }
    return this.http.post<string>(`${environment.liquidDuckBackend}/save/spread-sheet`,body)
  }

  public getSpreadSheet(id:number): Observable<any>{
    return this.http.get<any>(`${environment.liquidDuckBackend}/get/spread-sheet/${id}`)
  }

  public getAllSpreadSheets(): Observable<any>{
    return this.http.get<any>(`${environment.liquidDuckBackend}/get/spread-sheet/all`)
  }
}
