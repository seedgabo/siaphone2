import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {FilterArrayPipe} from '../../pipes/FilterArrayPipe';
import {CarteraPorClientePage} from '../cartera-por-cliente/cartera-por-cliente';
@Component({
    templateUrl: 'build/pages/cartera/cartera.html',
    pipes: [FilterArrayPipe]
})
export class CarteraPage {
    nav:NavController;
    total:number;
    procesando:boolean=false;
    constructor(nav: NavController, private api:Api) {
        this.nav = nav;
        this.getCartera();
    }

    getCartera(){
        this.procesando = true;
        this.api.getCartera().then(data=>{
            this.procesando = false;
            this.api.cartera = data.cartera;
            this.total = data.total;
        });
    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return "$ " + numero.format(2, 3, '.', ',') ;
    }

    verCarteraCliente(cliente){
        this.nav.push(CarteraPorClientePage,{cliente: cliente});
    }
}
