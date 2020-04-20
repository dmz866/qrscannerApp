import { Registro } from './../app/models/registro.model';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  registrosGuardados: Registro[] = [];

  constructor(private file: File, private storageService: Storage, 
    private navCtrl: NavController, private iab: InAppBrowser,
    private emailComposer: EmailComposer) {
    this.cargarRegistros();
  }

  guardarRegistro(format: string, text: string) {
    const nuevoRegistro = new Registro(format, text);
    this.registrosGuardados.unshift(nuevoRegistro);
    this.storageService.set('registros', this.registrosGuardados);
    this.abrirRegistro(nuevoRegistro);
  }

  async cargarRegistros() {
    this.registrosGuardados = await this.storageService.get('registros') || [];
  }
  
  abrirRegistro(registro: Registro) {
    this.navCtrl.navigateForward('/tabs/tab2');
    
    switch(registro.type) {
      case 'http':
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }
  }

  enviarCorreo() {
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.registrosGuardados.forEach(registro => 
    {
      arrTemp.push(`${registro.type},${registro.format},${registro.created},${registro.text.replace(',',' ')}\n`);
    });

    this.crearArchivoCSV(arrTemp.join(''));
  }

  crearArchivoCSV(text: string) {
    this.file.checkDir(this.file.dataDirectory, 'registros.csv').then(_ => 
    {
      return this.escribirEnArchivo(text);
    }).catch(err =>
    {
      return this.file.createFile(this.file.dataDirectory, 'registros.csv', false).then(creado => 
      {
        this.escribirEnArchivo(text);
      });
    });
  }

  async escribirEnArchivo(text: string) {
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);

    const email = {
      to: 'dmz866@hotmail.com',
      attachments: [
        `${this.file.dataDirectory}registros.csv`
      ],
      subject: 'Backup Scans',
      body: 'Aqui tiene sus backups de los scans - <strong>ScanApp</strong>',
      isHtml: true
    }

    this.emailComposer.open(email);
  }
}
