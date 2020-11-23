import { Component, ChangeDetectorRef, AfterViewInit} from "@angular/core";
import Quagga from 'quagga';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'shopping';
  errorMessage: string;
  public lastScannedCode: string;
  private lastScannedCodeDate: number;
  public shoppingCart = [1,2,3];
  public nowCode: number;
  public quantity = 1;
  public stores = ["Countdown", "PakNSave", "New World", "Supervalue", "FreshChoice", "DH Mart", "Spice World"]
  
 
  
  constructor(private changeDetectorRef: ChangeDetectorRef){}
  
  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }

    Quagga.init({
        inputStream: {
          constraints: {
            facingMode: 'environment'
          },
          area: { // defines rectangle of the detection/localization area
            top: '40%',    // top offset
            right: '0%',  // right offset
            left: '0%',   // left offset
            bottom: '40%'  // bottom offset
          },
        },
        decoder: {
          readers: ['ean_reader']
        },
      },
      (err) => {
        if (err) {
          this.errorMessage = `QuaggaJS could not be initialized, err: ${err}`;
        } else {
          Quagga.start();
          Quagga.onDetected((res) => {
            this.onBarcodeScanned(res.codeResult.code);
          });
        }
      });

  //  setTimeout(() => {
  //    this.updateService.checkForUpdates();
  //  }, 10000);
  }
  
   onBarcodeScanned(code: string) {
    console.log(code);
    // ignore duplicates for an interval of 1.5 seconds
    const r = window.confirm(code);
    if(r){
	  this.shoppingCart.push(Number(code));
      //window.alert(this.shoppingCart);
      window.open('https://shop.countdown.co.nz/shop/searchproducts?search='+code, '_blank');
	  
    }
 /*   const now = new Date().getTime();
    if (code === this.lastScannedCode && (now < this.lastScannedCodeDate + 1500)) {
      return;
    }
*/
    // ignore unknown articles
  //  const article = this.catalogue.find(a => a.ean === code);
   // if (!article) {
    //  return;
   // }

    //this.shoppingCart.addArticle(article);

    this.lastScannedCode = code;
  //  this.lastScannedCodeDate = now;
    //this.beepService.beep();
    //this.changeDetectorRef.detectChanges();
  }
  
  onSubmit(f: NgForm) {
	  console.log(f.value.barcode);
	  console.log(f.value.productName);
	  console.log(f.value.description);
	  console.log(f.value.price);
	  console.log(f.value.quantity);
	  
  }
}
