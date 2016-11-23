import {NavController, ToastController, ActionSheetController, AlertController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {ItemDetailsPage} from "../item-details/item-details";
import {FilterArrayPipe} from '../../pipes/FilterArrayPipe';
import {ListPage} from "../list/list";
import {Component} from '@angular/core';
declare var Enumerable;
declare var window:any;
declare var cordova:any;
@Component({
    templateUrl: 'build/pages/productos/productos.html',
      pipes: [FilterArrayPipe]
})
export class ProductosPage {
    api:Api;
    actualPage:number=1;
    currentPage:number=0;
    lastPage:number=0;
    mostrarImagenes:boolean = false;
    procesando:boolean = false;
    query= "";
    productos:any;
    constructor(public nav: NavController,api: Api, private toast:ToastController,private actionsheet:ActionSheetController, public alert:AlertController) {
        this.api = api;
        this.nav = nav;
        if( !this.api.cliente)
        {
            this.toast.create({message:"Seleccione un cliente primero", duration: 3500}).present();
            this.nav.setRoot(ListPage);
        }
        this.getProductos();
    }



    ionViewDidEnter(){
        window.setTimeout(()=>{
            window.document.getElementsByClassName('searchbar-input')[0].focus();
            this.query = "";
        },500);
    }

    getProductos(){
        let api = this.api;
        if(this.api.offline){
            this.productos = Enumerable.From(this.api.productos)
                  .Where(function (x) { return x.empresa_id ==  api.empresa; })
                //   .OrderBy(function (x) { return x.NOM_TER })
                  .Select()
                  .ToArray();
                  this.currentPage = 1;
                  this.lastPage = 1;
                  console.log(this.productos);
        }
        else{
            this.procesando= true;
            this.api.getProductos(this.actualPage).then((response:any) => {
                this.procesando = false;
                this.currentPage = response.current_page;
                this.lastPage = response.last_page;
                this.productos  = response.data;
            });
        }
    }

    goNext(){
        this.actualPage++;
        this.getProductos();
    }

    goPrevious(){
        this.actualPage--;
        this.getProductos();
    }

    verProducto(producto){
        this.nav.push(ItemDetailsPage , {producto: producto});
    }

    doInfinite(infiniteScroll){
        this.api.getProductos(this.actualPage).then((response:any) => {
            this.api.productos = response;
            this.actualPage++;
            if(this.api.productos.length){
                infiniteScroll.enable(false);
            }
            infiniteScroll.complete();
        });
    }

    buscarProducto(){
        if(!this.api.offline){
            this.procesando = true;
            this.api.searchProducto(this.query).then((response:any) =>{
                this.procesando = false;
                this.currentPage = response.current_page;
                this.lastPage = response.last_page;
                this.productos = response.data;
            });
        }
    }

    presentActionSheet() {
        let Sheet = this.actionsheet.create({
            title: 'Acciones',
            buttons: [
                {
                    text: 'Alternar Imagenes',
                    icon: "images",
                    handler: () => {
                        this.mostrarImagenes= !this.mostrarImagenes;
                    }
                },{
                    text: 'Actualizar',
                    icon: "refresh",
                    handler: () => {
                        this.query = "",
                        this.actualPage =1;
                        this.getProductos();
                    }
                },{
                    text: 'Cancelar',
                    role: 'cancel',
                    icon: "close",
                    handler: () => {
                    }
                }
            ]
        });
        Sheet.present()
    }

    verPath(){
        this.alert.create({
            title: "Ver Archivos Localmente",
            message: "Guarde las imagenes en el directorio del telefono: " + cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/. \n  como jpg",
            buttons: ["Ok"]
        }).present();
    }

    imagenLocal(producto:any){
        return cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/" + producto.COD_REF.trim()  + ".jpg";
    }
}
