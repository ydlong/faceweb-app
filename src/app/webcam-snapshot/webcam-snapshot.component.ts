import { OnInit, AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs"
import { DomSanitizer } from '@angular/platform-browser';
import { AppService } from "../app.services";
import { Subscription } from "rxjs";

@Component({
  selector: "app-webcam-snapshot",
  templateUrl: "./webcam-snapshot.component.html",
  styleUrls: ["./webcam-snapshot.component.scss"]
})

export class WebcamSnapshotComponent implements AfterViewInit {
  constructor (private http: HttpClient, private sanitizer: DomSanitizer, private appService:AppService){}

  clockEventsubscription!: Subscription;
  clockCurr!:string;

  videoShow = true;
  photoShow = false;

  WIDTH = 640;
  HEIGHT = 480;

  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured!: boolean;

  private dfapiUrl!:string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  faceData = {}
  matches:any ;

  imgPath=""

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  postCapture():Observable<any> {
    this.faceData = {"img": this.captures[this.captures.length-1] }
    return this.http.post(this.dfapiUrl, this.faceData, this.httpOptions)   
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }



  capture() {
    
    this.clockEventsubscription =  this.appService.getCapturedEvent().subscribe((dt)=>{
      this.clockCurr = dt;
    })

    let currurl = window.location.href;
    let urlarr = currurl.split(":");
    if (urlarr[1] === "//localhost"){
      this.dfapiUrl = "https://192.168.1.176:5000/find";
    } else {
      this.dfapiUrl = urlarr[0] + ":" + urlarr[1] + ":5000/find";
    }
    
    this.drawImageToCanvas(this.video.nativeElement); 
    this.captures.push(this.canvas.nativeElement.toDataURL("image/jpeg"));
    
    this.postCapture().subscribe(match => {
      this.matches = match;
      let rtImg= this.matches.finding.dispimg  ;
      let dt = this.matches.finding.dt;

      this.videoShow = false;
      this.photoShow = true;
      if (rtImg != undefined){
        this.imgPath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'  + rtImg) as string;
      } else {
        this.imgPath ='assets/happy.jpg' ;
      }
        console.log(this.imgPath, this.clockCurr);
      });
    
    this.isCaptured = true;
    
  }

  removeCurrent() {
    this.videoShow = true;
    this.photoShow = false;
    this.ngAfterViewInit();
    this.isCaptured = false;
    this.clockEventsubscription.unsubscribe(); 
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }


}
