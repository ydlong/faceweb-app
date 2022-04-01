
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class AppService {
    //isCapture: boolean;
    //isCaptured: Subject<boolean> = new Subject<boolean>();
    clockTime: Subject<string> = new Subject<string>();

    sendCapturedEvent(currDT:string) {
        //this.isCaptured.next(true);
        this.clockTime.next(currDT);
      }

    getCapturedEvent(): Observable<any>{ 
        //return this.isCaptured.asObservable();
        return this.clockTime.asObservable();
    }

}