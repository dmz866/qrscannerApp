import { Registro } from './../../models/registro.model';
import { DataLocalService } from './../../../services/data-local.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public dataLocalService: DataLocalService) {}

  abrirRegistro(registro: Registro) {
    this.dataLocalService.abrirRegistro(registro);  
  }
 
  enviarCorreo() {
    this.dataLocalService.enviarCorreo();
  }
}
