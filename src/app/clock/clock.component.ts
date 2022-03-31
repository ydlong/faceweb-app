
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-clock",
    templateUrl: "./clock.component.html",
    styleUrls: ["./clock.component.css"]
})

export class ClockComponent {

    constructor(){}

    year!: string;
    month!: string;
    appday!: string;
    hours!: string;
    minutes!: string;
    seconds!: string;
    private timerId!:any ;
    currDT: string = ''; 
    
    ngOnInit() {
        this.setCurrentTime();
        this.timerId = this.updateTime();
    }

    ngOnDestroy() {
        clearInterval(this.timerId);
    }

    private setCurrentTime() {
        const time = new Date(Date.now());
        this.year = this.leftPadZero(time.getUTCFullYear());
        this.month = time.toLocaleString('en-us', { month: 'short' }); 
        this.appday = this.leftPadZero(time.getUTCDate());
        this.hours = this.leftPadZero(time.getHours());
        this.minutes = this.leftPadZero(time.getMinutes());
        this.seconds = this.leftPadZero(time.getSeconds());
        this.currDT = this.hours+" "+this.minutes+" "+this.seconds;
    }

    private updateTime() {
        setInterval(() => {
            this.setCurrentTime();
        }, 1000);
    }

    private leftPadZero(value: number) {
        return value < 10 ? `0${value}` : value.toString();
    }

}