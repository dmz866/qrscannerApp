import { Registro } from './../app/models/registro.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  registrosGuardados: Registro[] = [];

  guardarRegistro(format: string, text: string) {
    this.registrosGuardados.unshift(new Registro(format, text));
  }
}
