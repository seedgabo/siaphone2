import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {FilterArrayPipe} from '../../pipes/FilterArrayPipe';
import {CarteraPorClientePage} from '../cartera-por-cliente/cartera-por-cliente';
declare var Number:any;
declare var Enumerable;
@Component({
    templateUrl: 'build/pages/cartera/cartera.html',
    pipes: [FilterArrayPipe]
})
export class CarteraPage {
    nav:NavController;
    total:number;
    procesando:boolean=false;
    cartera:any;
    constructor(nav: NavController, private api:Api) {
        this.nav = nav;
        this.getCartera();
    }

    getCartera(){
        let api = this.api;
        if(this.api.offline){
            this.cartera = Enumerable.From(this.api.cartera)
                  .Where(function (x) { return x.empresa_id ==  api.empresa; })
                //   .OrderBy(function (x) { return x.NOM_TER })
                  .Select()
                  .ToArray();
            this.total = this.api.cartera_total;
        }
        else
        {
            this.procesando = true;
            this.api.getCartera().then((data:any)=>{
                this.procesando = false;
                this.cartera = data.cartera;
                this.total = data.total;
            });
        }
    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return "$ " + numero.format(2, 3, '.', ',') ;
    }

    verCarteraCliente(cliente){
        this.nav.push(CarteraPorClientePage,{cliente: cliente});
    }
}
