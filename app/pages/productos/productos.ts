import {NavController, Toast, ActionSheet} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {ItemDetailsPage} from "../item-details/item-details";
import {ListPage} from "../list/list";
import {Component} from '@angular/core';
@Component({
    templateUrl: 'build/pages/productos/productos.html',
})
export class ProductosPage {
    api:any;
    actualPage:number=1;
    currentPage:number=0;
    lastPage:number=0;
    mostrarImagenes:boolean = false;
    procesando:boolean = false;
    query= "";
    constructor(public nav: NavController,api: Api) {
        this.api = api;
        this.nav = nav;
        if( !this.api.cliente)
        {
            this.nav.present(Toast.create({message:"Seleccione un cliente primero", duration: 3500}));
            this.nav.setRoot(ListPage);
        }
        this.getProductos();
    }

    getProductos(){
        this.procesando= true;
        this.api.getProductos(this.actualPage).then((response) => {
            this.procesando = false;
            this.currentPage = response.current_page;
            this.lastPage = response.last_page;
            this.api.productos = response.data;
        });
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
        this.api.getProductos(this.actualPage).then((response) => {
            this.api.productos = response;
            this.actualPage++;
            if(this.api.productos.length){
                infiniteScroll.enable(false);
            }
            infiniteScroll.complete();
        });
    }

    buscarProducto(){
        this.procesando = true;
        this.api.searchProducto(this.query).then((response) =>{
            this.procesando = false;
            this.currentPage = response.current_page;
            this.lastPage = response.last_page;
            this.api.productos = response.data;
        });
    }

    presentActionSheet() {
        let actionSheet = ActionSheet.create({
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
        this.nav.present(actionSheet);
    }
}
