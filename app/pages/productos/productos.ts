import {Page, NavController} from 'ionic-angular';
import {Api} from "../../providers/api/api";
import {Toast} from 'ionic-native';

import {ItemDetailsPage} from "../item-details/item-details";
import {ListPage} from "../list/list";


@Page({
  templateUrl: 'build/pages/productos/productos.html',
})
export class ProductosPage {
    api:any; actualPage:number=1;
   constructor(public nav: NavController,api: Api) {
      this.api = api;
      this.nav = nav;
      if( !this.api.cliente)
      {
          Toast.showLongBottom("Seleccione un cliente primero").subscribe(toast => {});
          this.nav.setRoot(ListPage);
      }
      this.api.productos = [];
      this.api.getProductos(this.actualPage).then((response) => {this.api.productos = this.api.productos.concat(response); this.actualPage++;});

  }

  verProducto(producto){
      this.nav.push(ItemDetailsPage , {producto: producto});
  }

  doInfinite(infiniteScroll){
      this.api.getProductos(this.actualPage).then((response) => {
          this.api.productos = this.api.productos.concat(response);
          this.actualPage++;
          console.log(this.api.productos.length);
          infiniteScroll.complete();
      });
  }
}
