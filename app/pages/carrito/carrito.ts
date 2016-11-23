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
    carrito:Array<any>=[];
    button_disable = true;
    searchQuery:string="";
    productos:any;
    agregando:any =0;
    total:any=0;
    constructor(public nav:NavController,private api:Api, private toastctrl:ToastController,private modalctrl:ModalController, private loadingctrl:LoadingController, private alert:AlertController) {
        this.nav = nav;
        if( !this.api.cliente)
        {
            this.toastctrl.create({message:"Seleccione un cliente primero", duration: 3500}).present();
            this.nav.setRoot(ListPage);
        }
        this.api.storage.get("agregando-"+ this.api.empresa).then((data)=>{ data? this.agregando =  data : this.agregando = 12});
        this.getCarrito();
        this.api.getCarritos().then(response=>{
                console.log(response.res);
        });
    }

    getCarrito(){
        this.carrito = [];
        this.api.getCarrito().then(response =>{
            this.total = 0;
            for (var i = 0; i < response.res.rows.length; i++) {
                this.carrito.push(response.res.rows[i]);
                this.total += response.res.rows[i].cantidad * response.res.rows[i].VAL_REF;
            }
            console.log(this.carrito);
            this.button_disable =  (this.carrito.length == 0);
        });
    }

    cambiarPrecio(producto){
        let prompt = this.alert.create({
            title: 'Cambiar Precio:',
            inputs: [
                {
                    name: 'precio',
                    placeholder: 'precio',
                    type: 'number',
                    value: producto.VAL_REF
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
                        this.api.storage.query("update carrito set VAL_REF = ? where ID= ?",[parseFloat(data.precio), producto.ID]).then( resp =>{
                            this.toastctrl.create({message:"Actualizado Correctamente", duration: 1500}).present();
                            this.getCarrito();
                        });
                    }
                }
            ]
        });
        prompt.present();
    }

    cambiarCantidad(producto){
        let prompt = this.alert.create({
            title: 'Cambiar Cantidad:',
            inputs: [
                {
                    name: 'cantidad',
                    placeholder: 'cantidad',
                    type: 'number',
                    value: producto.cantidad
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
                        this.api.storage.query("update carrito set cantidad = ? where ID= ?",[parseInt(data.cantidad), producto.ID]).then( resp =>{
                            this.toastctrl.create({message:"Actualizado Correctamente", duration: 1500}).present();
                            this.getCarrito();
                        });
                    }
                }
            ]
        });
        prompt.present();
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
        }).catch((error)=>{
            loading.dismiss().then(()=>{
                this.alert.create({title:"ERROR", message: "Parece que hubo un error al procesar el pedido, verifique en portal web y compruebe su conexion a internet"});
            })
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
                    this.api.storage.set("agregando-"+ this.api.empresa,data.agregando);
                }
            }
        ]}).present();
    }

    onInput(ev){
        let q = this.searchQuery;

        if(q.length == 0)
            return;

        let producto = Enumerable.From(this.api.productos)
        .Where((x)=> { return x.COD_REF.trim() == q.trim(); })
        .Where((x)=> { return x.empresa_id == this.api.empresa; })
        .Select()
        .ToArray()[0];

        if(producto)
        {
            if(this.agregando == 0)
            {
                 this.preguntarCantidad(producto);
                 ev.target.focus();
                 return;
            }
            else
            {
                this.api.addToCart(producto, parseInt(this.findByCod(q)) +  parseInt(this.agregando));
            }
            this.getCarrito();
            ev.target.focus();
            this.searchQuery = "";
        }
        else
        {
            this.searchQuery = "";
            this.toastctrl.create({message:"No se consiguió ninguno producto con este codigo", duration: 2000,position:"top"}).present().then(()=>{
                ev.target.focus();
            });
        }
    }

    preguntarCantidad(producto){
        let prompt = this.alert.create({
            title: 'Cantidad:',
            inputs: [
                {
                    name: 'cantidad',
                    placeholder: 'cantidad',
                    type: 'number',
                    value: producto.cantidad
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
                    handler: (data) => {
                            this.api.addToCart( producto, parseInt(this.findByCod(this.searchQuery)) + parseInt(data.cantidad));
                            this.getCarrito();
                            this.searchQuery = "";
                    }
                }
            ]
        });
        prompt.present();
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
