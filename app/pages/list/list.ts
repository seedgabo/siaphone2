import {NavController, NavParams} from 'ionic-angular';
import {ItemDetailsPage} from '../item-details/item-details';
import {FilterArrayPipe} from '../../pipes/FilterArrayPipe';
import {Api} from "../../providers/api/api";
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/list/list.html',
    pipes: [FilterArrayPipe]
})
export class ListPage {

    api:any;
    query="";
  constructor(private nav: NavController, navParams: NavParams ,api: Api) {
      this.api = api;
      this.api.getClientes().then( (response) => {api.clientes = response});
  }

  itemTapped(event, item) {
     this.api.setClienteSelected(item);
  }

  seleccionado(cliente){
      return (cliente && this.api.cliente && (this.api.cliente.id == cliente.id));
  }
}
