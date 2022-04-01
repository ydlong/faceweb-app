
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { AppService } from "../app.services";

@Component({
    selector: "app-clock",
    templateUrl: "./clock.component.html",
    styleUrls: ["./clock.component.css"]
})

export class ClockComponent {

    constructor(private appService:AppService){}

    year!: string;
    month!: string;
    appday!: string;
    hours!: string;
    minutes!: string;
    seconds!: string;
    private timerId!:any ;
    currDT!: string; 
    
    ngOnInit() {
        this.setCurrentTime();
        this.timerId = this.updateTime();
    }

    ngOnDestroy() {
        clearInterval(this.timerId);
    }

    private setCurrentTime() {
        const time = new Date(Date.now());
        this.year = this.leftPadZero(time.getFullYear());
        this.month = time.toLocaleString('en-us', { month: 'short' }); 
        this.appday = this.leftPadZero(time.getDate());
        this.hours = this.leftPadZero(time.getHours());
        this.minutes = this.leftPadZero(time.getMinutes());
        this.seconds = this.leftPadZero(time.getSeconds());

        this.currDT = this.month+ " "+this.appday+", "+this.year+" "+this.hours+" "+this.minutes+" "+this.seconds;
        this.appService.sendCapturedEvent(this.currDT);
    }

    private updateTime() {
        setInterval(() => {
            this.setCurrentTime();
        }, 1000);
    }

    private leftPadZero(value: number) {
        return value < 10 ? `0${value}` : value.toString();
    }

    public getCurrDT():string{
        return this.currDT;
    }

}