import {Page, NavController, Loading,Alert} from 'ionic-angular';
import {Api} from "../../providers/api/api";

@Page({
    templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
})
export class HelloIonicPage {
    username:any;api:any;user:any;nav; empresas:any = [];
    constructor(api :Api, nav:NavController) {
        this.api = api;
        this.nav = nav;
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
}
