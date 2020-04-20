import { DataLocalService } from './../../../services/data-local.service';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private barcodeScanner: BarcodeScanner, private dataLocalService: DataLocalService) { }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => 
    {
      if (!barcodeData.cancelled) {
        this.dataLocalService.guardarRegistro(barcodeData.format, barcodeData.text);
      }
    }).catch(err => {
      //this.dataLocalService.guardarRegistro('QRCODE', 'www.google.com');
      this.dataLocalService.guardarRegistro('GEO', 'geo:-0.215215,-78.507675');
     });
  }
}
