import { Component, ChangeDetectorRef, AfterViewInit, ViewChild} from "@angular/core";
import Quagga from 'quagga';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
	
  @ViewChild("f") productForm: NgForm;	
  title = 'shopping';

  errorMessage: string;
  public lastScannedCode: string;
  public currentProductName: string;
  public currentDescription: string;
  public currentPrice: number;
  private lastScannedCodeDate: number;
  public shoppingCart = [];
  public currentQuantity = 1;
  public stores = ["Countdown", "PakNSave", "New World", "Supervalue", "FreshChoice", "DH Mart", "Spice World"]
  public total = 0;
 
  
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
    const now = new Date().getTime();
    if (code === this.lastScannedCode && (now < this.lastScannedCodeDate + 30000)) {
      return;
    }else{
		const r = window.confirm(code);
		if(r){
		  //this.shoppingCart.push(Number(code));
		  //window.alert(this.shoppingCart);
		  //window.open('https://shop.countdown.co.nz/shop/searchproducts?search='+code, '_blank');
		  this.lastScannedCode = code;
		  this.lastScannedCodeDate = now;
		  if(localStorage.getItem(code)!=null){
			   var item = JSON.parse(localStorage.getItem(this.lastScannedCode));
			   this.productForm.controls['barcode'].setValue(code);
			   this.productForm.controls['productName'].setValue(item.productName);
			   this.productForm.controls['description'].setValue(item.description);
			   this.productForm.controls['price'].setValue(item.price);
		  }else{	
		       this.productForm.resetForm();
		       this.productForm.controls['barcode'].setValue(code);		  
		  }
	}
   }

    // ignore unknown articles
  //  const article = this.catalogue.find(a => a.ean === code);
   // if (!article) {
    //  return;
   // }

    //this.shoppingCart.addArticle(article);

    
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
	  var subtotal = f.value.price * f.value.quantity;
	  this.total = this.total + subtotal;
	  var jsonobj = JSON.stringify({"productName": f.value.productName, "description": f.value.description, "price": f.value.price});
	  localStorage.setItem(this.lastScannedCode, jsonobj); 
	  alert("added :" + jsonobj);
	  jsonobj = JSON.stringify({"productName": f.value.productName, "description": f.value.description, "price": f.value.price, "quantity": f.value.quantity, "subtotal": subtotal});
	  this.shoppingCart.push(JSON.parse(jsonobj));
	  f.resetForm();
	  
  }
  
  removeItem(i: number) {
	  alert("deleted" + i);
	  var subtotal = this.shoppingCart[i].subtotal;
	  this.total = this.total - subtotal;
	  this.shoppingCart.splice(i, 1);
  }
}
