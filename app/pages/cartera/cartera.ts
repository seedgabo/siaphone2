import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {FilterArrayPipe} from '../../pipes/FilterArrayPipe';

@Component({
  templateUrl: 'build/pages/cartera/cartera.html',
  pipes: [FilterArrayPipe]
})
export class CarteraPage {
    nav:NavController;
    total:number;
  constructor(public nav: NavController, private api:Api) {
      this.nav = nav;
      this.getCartera();
  }

  getCartera(){
      this.api.getCartera().then(data=>{
         console.log(data.cartera);
         this.api.cartera = data.cartera;
         this.total = data.total;
      });
  }
  toCurrency(number:string){
      let numero=  Number.parseFloat(number);
      return "$ " + numero.format(2, 3, '.', ',') ;
  }

}
