import {Page, NavController, NavParams, ViewController, ToastController,AlertController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Api} from '../../providers/api/api';
declare var cordova:any;
@Component({
    templateUrl: 'build/pages/item-details/item-details.html'
})
export class ItemDetailsPage {
    producto: any;
    pedidos:number =0;
    api:Api
    modal = false;
    constructor(public nav: NavController, navParams: NavParams, api:Api, public viewCtrl: ViewController, public toast:ToastController, public alert:AlertController) {
        this.api = api;
        this.producto = navParams.get('producto');

        if(navParams.get('pedidos')!= undefined)
        this.pedidos = navParams.get('pedidos');

        else
        this.api.storage.get("agregando-"+ this.api.empresa).then((data)=>{ data? this.pedidos =  parseInt(data) : this.pedidos = 12});

        if(navParams.get('modal') == true)
        this.modal = true;
    }

    agregarAlCarrito(){
        this.api.addToCart(this.producto, this.pedidos).then((resp) =>{
            console.log(resp);
            this.toast.create({message:"Agregado al Carrito", duration:2000, showCloseButton: true}).present();
            this.dismiss();
        });
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    editprecio(){
        this.alert.create({
              title: 'Editar Precio',
              inputs: [
                {
                  name: 'precio',
                  placeholder: 'Precio',
                  value: "" +parseInt(this.producto.VAL_REF),
                  type: "number"
                },
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Guardar',
                  handler: data => {
                      this.producto.VAL_REF = parseInt(data.precio);
                  }
                }
              ]
          }).present();
    }

    imagenLocal(producto:any){
        return cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/" + producto.COD_REF.trim()  + ".jpg";
    }
}
