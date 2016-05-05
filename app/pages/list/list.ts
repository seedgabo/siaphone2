import {Page, NavController, NavParams} from 'ionic-angular';
import {ItemDetailsPage} from '../item-details/item-details';
import {Api} from "../../providers/api/api";

@Page({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage {

    api:any;
  constructor(private nav: NavController, navParams: NavParams ,api: Api) {
      this.api = api;
      this.api.getClientes().then( (response) => {console.log(response); api.clientes = response});

  }

  itemTapped(event, item) {
     this.api.setClienteSelected(item);
  }

  seleccionado(cliente){
      return (cliente && this.api.cliente && (this.api.cliente.id == cliente.id));
  }
}
