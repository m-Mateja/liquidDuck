import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket
  constructor() {
    this.socket = io('http://127.0.0.1:5000', {
      transports: ['websocket'],
      secure: false,
      rejectUnauthorized: false,
      query:{
        sessionId: crypto.randomUUID()
      }
    })
  }

  public sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  public on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }
}
