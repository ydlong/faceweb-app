import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { WebcamSnapshotModule } from "./webcam-snapshot/webcam-snapshot.module";
import { ClockModule } from "./clock/clock.module";

@NgModule({
  imports: [BrowserModule, FormsModule, WebcamSnapshotModule, ClockModule, HttpClientModule],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
