import {Component, NgZone} from '@angular/core';
import {NavController,ToastController,ModalController, LoadingController, AlertController} from 'ionic-angular';
import {ListPage} from "../list/list";
import {ItemDetailsPage} from '../item-details/item-details';
import {Api} from "../../providers/api/api";
declare var Number:any;
declare var Enumerable:any;
@Component({
    templateUrl: 'build/pages/carritos/carritos.html',
})
export class CarritosPage {
    carritos:Array<any>=[];
    button_disable = true;
    searchQuery:string="";
    productos:any;
    agregando:any =0;
    total:any=0;
    constructor(public nav:NavController,private api:Api, private toastctrl:ToastController,private modalctrl:ModalController, private loadingctrl:LoadingController, private alert:AlertController, public zone : NgZone) {
        this.nav = nav;
        this.getCarritos();
    }

    getCarritos(){
        this.carritos = [];
        this.api.getCarritos().then(response =>{
            this.carritos = Object.keys(response.res.rows).map(key => response.res.rows[key]);
            this.carritos.forEach((carrito) =>{
                carrito.NOM_TER = Enumerable.From(this.api.clientes)
                      .Where((x) => { return x.COD_TER.trim() == carrito.COD_CLI.trim(); })
                      .First().NOM_TER;
            });
        });
    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return "$ " + numero.format(2, 3, '.', ',') ;
    }


    procesarCarrito(carrito){
        let loading = this.loadingctrl.create({content: "Procesando el Carrito... esto puede tardar unos segundos"});
        loading.present();

        var cart;
        this.api.getCarritoAsync(carrito).then(resp =>{
            cart = resp.res.rows;

            this.api.sendCarrito(cart)
            .then((data)  =>{
                this.api.storage.query("delete from carrito where COD_CLI = ?",[carrito.COD_CLI]).then( resp =>{
                    loading.dismiss().then(()=>{
                        this.toastctrl.create({message:"Carrito Procesado", duration: 1500}).present();
                    });
                    this.getCarritos();
                });
            })
            .catch((error)=>{
                loading.dismiss().then(()=>{
                    this.alert.create({title:"ERROR", message: "Parece que hubo un error al procesar el pedido, verifique en portal web y compruebe su conexion a internet"});
                })
            });

        });

    }

    clearCarrito(){
        this.api.storage.query("delete from carrito where COD_CLI = ?",[this.api.cliente.COD_TER]).then( resp =>{
            this.toastctrl.create({message:"Carrito Vaciado", duration: 1500}).present();
            this.getCarrito();
        });
    }

}
