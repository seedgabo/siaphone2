import {Page, NavController, NavParams, ViewController, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {Api} from '../../providers/api/api';
@Component({
  templateUrl: 'build/pages/item-details/item-details.html'
})
export class ItemDetailsPage {
  producto: any;
  pedidos:number =0;
  api:Api
  modal = false;
  constructor(private nav: NavController, navParams: NavParams, api:Api, private viewCtrl: ViewController) {
      this.api = api;
      this.producto = navParams.get('producto');
      if(navParams.get('pedidos')!= undefined)
        this.pedidos = navParams.get('pedidos');
      if(navParams.get('modal') == true)
        this.modal = true;
  }

  agregarAlCarrito(){
      this.api.addToCart(this.producto, this.pedidos).then((resp) =>{
          console.log(resp);
          this.nav.present(Toast.create({message:"Agregado al Carrito", duration:2000, showCloseButton: true}));
      });
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }
}
