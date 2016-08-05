import {Component} from '@angular/core';
import {NavController,Toast,Modal, Loading} from 'ionic-angular';
import {ListPage} from "../list/list";
import {ItemDetailsPage} from '../item-details/item-details';
import {Api} from "../../providers/api/api";

@Component({
    templateUrl: 'build/pages/carrito/carrito.html',
})
export class CarritoPage {
    api:Api;
    carrito:Array<any>=[];
    button_disable = true;
    constructor(public nav: NavController ,api:Api) {
        this.api = api;
        this.nav = nav;
        if( !this.api.cliente)
        {
            this.nav.present(Toast.create({message:"Seleccione un cliente primero", duration: 3500}));
            this.nav.setRoot(ListPage);
        }
        this.getCarrito()
    }

    getCarrito(){
        this.carrito = [];
        this.api.getCarrito().then(response =>{
            console.log(response.res.rows );
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
            this.nav.present(Toast.create({message:"Eliminado Correctamente", duration: 1500}));
            this.getCarrito();
        });
    }

    editar(producto){
        this.api.findProducto(producto.COD_REF).then((data)=>{
            let modal = Modal.create(ItemDetailsPage, {producto: data, pedidos: producto.cantidad, modal:true});
            this.nav.present(modal);
            modal.onDismiss(()=>{
                this.getCarrito();
            })

        });
    }

    procesarCarrito(){
        let loading = Loading.create({content: "Procesando el Carrito... esto puede tardar unos segundos"});
        this.nav.present(loading);
        this.api.sendCarrito(this.carrito).then((data)=>{
            this.api.storage.query("delete from carrito where COD_CLI = ?",[this.api.cliente.COD_TER]).then( resp =>{
                loading.dismiss().then(()=>{
                    this.nav.present(Toast.create({message:"Carrito Procesado", duration: 1500}));
                });
                this.getCarrito();
            });
        });
    }

    clearCarrito(){
        this.api.storage.query("delete from carrito where COD_CLI = ?",[this.api.cliente.COD_TER]).then( resp =>{
            this.nav.present(Toast.create({message:"Carrito Vaciado", duration: 1500}));
            this.getCarrito();
        });
    }
}
