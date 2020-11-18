import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'shopping';
   @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent;
 
  barcodeValue;
 
  ngAfterViewInit() {
    this.barcodeScanner.start();
  }
 
  onValueChanges(result) {
    this.barcodeValue = result.codeResult.code;
  }
 
  onStarted(started) {
    console.log(started);
  }
}
