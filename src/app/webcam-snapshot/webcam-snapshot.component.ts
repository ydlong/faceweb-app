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
  private apiUrl!:string;

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

  saveCapture(saveData: {}): Observable<any> {
    const save_apiUrl = this.apiUrl+"captured";
    return this.http.post(save_apiUrl, saveData, this.httpOptions)        
  }

  /*
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  } */



  capture() {
    
    this.clockEventsubscription =  this.appService.getCapturedEvent().subscribe((dt)=>{
      this.clockCurr = dt;
    })

    let currurl = window.location.href;
    let urlarr = currurl.split(":");
    if (urlarr[1] === "//localhost"){
      this.apiUrl = "https://192.168.1.176:5000/";
    } else {
      this.apiUrl = urlarr[0] + ":" + urlarr[1] + ":5000/";
    }
    this.dfapiUrl = this.apiUrl + "find"

    this.drawImageToCanvas(this.video.nativeElement); 
    let captureImg = this.canvas.nativeElement.toDataURL("image/jpeg");
    this.captures.push(captureImg);
    
    this.postCapture().subscribe(match => {
      this.matches = match;
      let rtImg= this.matches.finding.dispimg  ;
      let matchedName!:string;
      let dt = this.matches.finding.dt;
      let cid = this.matches.trx_id;

      this.videoShow = false;
      this.photoShow = true;
      if (rtImg != ""){
        this.imgPath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'  + rtImg) as string;
        matchedName = this.matches.finding.matched_name;
      } else {
        this.imgPath ='assets/happy.jpg' ;
        matchedName = ""
      }

      // save captured
      console.log(matchedName);
      let saveData = { "dt": this.clockCurr, "id": cid, "img": captureImg, "name": matchedName }
      this.saveCapture(saveData).subscribe( save => {
         console.log(save) 
         if (save==="ok"){
           // email
         }
      } );
      
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
