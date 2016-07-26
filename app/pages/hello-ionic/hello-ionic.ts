import {NavController, Loading,Alert} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {ImageManager} from "../../providers/image-manager/image-manager";
import {Component} from '@angular/core';
@Component({
    templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
})
export class HelloIonicPage {
    username:any;
    constructor(private api:Api, private nav:NavController,  private img: ImageManager) {
        this.username = this.api.data;

    }


    doLogin (){
        let loading = Loading.create({content: "Iniciando Sesión", duration:10000});
        this.nav.present(loading);
        this.api.doLogin().then(data => {
            if (data.status)
            {
                let alert = Alert.create({
                     title: 'Error ' + data.status,
                     subTitle: data._body,
                     buttons: ['OK']
                });
               loading.dismiss();
               this.nav.present(alert);
                return;
            }
            this.api.setData(this.username.username, this.username.password, this.username.url);
            this.api.user = data;
            this.api.saveUser(data);
            loading.dismiss();
            this.getEmpresas();
        });
    };

    getEmpresas (){
        this.api.getEmpresas().then(data => {
            console.log(data);
            this.api.empresas = data;
        });
    };

    getClientes(){
        this.api.getClientes().then((data) =>{
            console.log(data);
        });
    }

    logout(){
        this.api.user = undefined;
        this.api.setData("","","");
    }

    descargarImagenProductos(){
        let loading = Loading.create({content:"Descargando Archivo Zip"});
        this.nav.present(loading);
        this.img.downloadZip( this.api.data.url + "all.zip", loading);
    }
}
