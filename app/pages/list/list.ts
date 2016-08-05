import {NavController, NavParams} from 'ionic-angular';
import {ItemDetailsPage} from '../item-details/item-details';
import {FilterArrayPipe} from '../../pipes/FilterArrayPipe';
import {Api} from "../../providers/api/api";
import {Component} from '@angular/core';
import {ProductosPage} from '../productos/productos';
@Component({
  templateUrl: 'build/pages/list/list.html',
    pipes: [FilterArrayPipe]
})
export class ListPage {

    api:any;
    query="";
    clientes:Array<any>;
  constructor(private nav: NavController, navParams: NavParams ,api: Api) {
      this.api = api;
      if(this.api.offline)
      {
          this.clientes = Enumerable.From(this.api.clientes)
                .Where(function (x) { return x.empresa_id ==  api.empresa; })
                .OrderBy(function (x) { return x.NOM_TER })
                .Select()
                .ToArray();
                console.log(this.clientes);
      }
      else
      {
          this.api.getClientes().then( (response) => {this.clientes = response});
      }
  }

  itemTapped(event, item) {
     this.api.setClienteSelected(item);
     this.nav.setRoot(ProductosPage);
  }

  seleccionado(cliente){
      return (cliente && this.api.cliente && (this.api.cliente.id == cliente.id));
  }
}
