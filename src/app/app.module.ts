import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { WebcamSnapshotModule } from "./webcam-snapshot/webcam-snapshot.module";

@NgModule({
  imports: [BrowserModule, FormsModule, WebcamSnapshotModule],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
