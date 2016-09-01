import {Component} from '@angular/core';
import {NavController,ToastController,ModalController, LoadingController, AlertController} from 'ionic-angular';
import {ListPage} from "../list/list";
import {ItemDetailsPage} from '../item-details/item-details';
import {Api} from "../../providers/api/api";
declare var Number:any;
declare var Enumerable:any;
@Component({
    templateUrl: 'build/pages/carrito/carrito.html',
})
export class CarritoPage {
    api:Api;
    carrito:Array<any>=[];
    button_disable = true;
    searchQuery:string="";
    productos:any;
    agregando:number =12;
    constructor(public nav: NavController ,api:Api, private toastctrl:ToastController,private modalctrl:ModalController, private loadingctrl:LoadingController, private alert:AlertController) {
        this.api = api;
        this.nav = nav;
        if( !this.api.cliente)
        {
            this.toastctrl.create({message:"Seleccione un cliente primero", duration: 3500}).present();
            this.nav.setRoot(ListPage);
        }
        this.getCarrito();
    }

    getCarrito(){
        this.carrito = [];
        this.api.getCarrito().then(response =>{
            for (var i = 0; i < response.res.rows.length; i++) {
                this.carrito.push(response.res.rows[i]);
            }
            this.button_disable =  (this.carrito.length == 0);
        });
    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return "$ " + numero.format(2, 3, '.', ',') ;
    }

    eliminar(producto){
        this.api.storage.query("delete from carrito where ID= ?",[producto.ID]).then( resp =>{
            this.toastctrl.create({message:"Eliminado Correctamente", duration: 1500}).present();
            this.getCarrito();
        });
    }

    editar(producto){
        this.api.findProducto(producto.COD_REF).then((data)=>{
            let modal =this.modalctrl.create(ItemDetailsPage, {producto: data, pedidos: producto.cantidad, modal:true});
            modal.present();
            modal.onDidDismiss(()=>{
                this.getCarrito();
            })

        });
    }

    procesarCarrito(){
        let loading = this.loadingctrl.create({content: "Procesando el Carrito... esto puede tardar unos segundos"});
        loading.present();
        this.api.sendCarrito(this.carrito).then((data)=>{
            this.api.storage.query("delete from carrito where COD_CLI = ?",[this.api.cliente.COD_TER]).then( resp =>{
                loading.dismiss().then(()=>{
                    this.toastctrl.create({message:"Carrito Procesado", duration: 1500}).present();
                });
                this.getCarrito();
            });
        });
    }

    clearCarrito(){
        this.api.storage.query("delete from carrito where COD_CLI = ?",[this.api.cliente.COD_TER]).then( resp =>{
            this.toastctrl.create({message:"Carrito Vaciado", duration: 1500}).present();
            this.getCarrito();
        });
    }

    cambiarAgregando(){
        this.alert.create({title:"¿Cuantos desea agregar por codigo?",inputs:[{type:"number",name:"agregando", value: this.agregando.toString()}],      buttons: [
            {
                text: 'Cancelar',
                handler: data => {
                    console.log('Cancel clicked');
                }
            },
            {
                text: 'Guardar',
                handler: data => {
                    this.agregando =  parseInt(data.agregando);
                }
            }
        ]}).present();
    }

    onInput(ev){
        let q = this.searchQuery;
        if(q.length == 0) return;
        let producto = Enumerable.From(this.api.productos)
        .Where(function (x) { return x.COD_REF.trim() == q.trim(); })
        .Select()
        .ToArray()[0];
        if(producto)
        {
            this.api.addToCart( producto, this.findByCod(q) + this.agregando);
            this.getCarrito();
            ev.target.focus();
            this.searchQuery = "";
        }
        else
        {
            ev.target.focus();
            this.searchQuery = "";
            this.toastctrl.create({message:"No se consiguió ninguno producto con este codigo", duration: 2000,position:"top"}).present();
        }
    }

    findByCod(codigo){
        let item  = Enumerable.From(this.carrito)
        .Where(function (x) { return x.COD_REF.trim() == codigo.trim(); })
        .Select()
        .ToArray()[0];
        if(item)
        {
            return item.cantidad
        }
        else
        {
            return 0;
        }
    }
}
