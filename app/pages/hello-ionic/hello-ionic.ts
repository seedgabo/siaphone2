import {NavController, LoadingController,AlertController,ToastController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {Component} from '@angular/core';
import { BarcodeScanner } from 'ionic-native';

@Component({
    templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
})
export class HelloIonicPage {
    username:any;
    last_update_data:any = "";
    constructor(private api:Api, private nav:NavController, private loadingctrl:LoadingController,private alertctrl:AlertController, private toastctrl:ToastController) {
        this.username = this.api.data;
        this.api.storage.get("last_update_data").then((date)=>{
            if(date != undefined){
                    this.last_update_data = new Date(date);
            }
        });

    }


    doLogin (){
        let loading = this.loadingctrl.create({content: "Iniciando Sesión", duration:10000});
        loading.present();
        this.api.doLogin().then((data:any) => {
            if (!data.email)
            {
                let alert = this.alertctrl.create({
                    title: 'Error ' + data.status,
                    subTitle: data._body,
                    buttons: ['OK']
                });
                loading.dismiss();
                alert.present();
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

    scanCode(){
        BarcodeScanner.scan().then((barcodeData) => {
             let data = JSON.parse(barcodeData.text);
             this.api.data.url = data.url + "/";
             this.api.data.username = data.username;
             this.api.data.password = "";
             this.username = this.api.data;
             this.api.token = data.token;
             this.api.storage.set("token", data.token);
             this.doLogin();
         }, (err) => {
            let alert =this.alertctrl.create({title:"Oops", subTitle: "Ocurrió un error " + err, buttons:["Ok"]}).present();
        });
    }

    getDataOffline(event){
            this.api.offline = !this.api.offline;
            this.api.storage.set("offline",this.api.offline);
            if(this.api.offline == true)
            {
                let loading = this.loadingctrl.create({content: "Descargando datos offline"});
                loading.present(loading);
                this.api.getDataOffline().then(data => {
                    loading.dismiss().then(() =>{
                        this.api.storage.set("last_update_data", new Date());
                        this.last_update_data = new Date();
                        this.toastctrl.create({message:"Datos Descargados Correctamente", duration: 2000, closeButtonText: "listo"}).present();
                    });
                });
            }
    }

}
