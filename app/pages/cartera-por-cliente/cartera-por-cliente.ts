import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Api} from '../../providers/api/api';

@Component({
    templateUrl: 'build/pages/cartera-por-cliente/cartera-por-cliente.html',
})

export class CarteraPorClientePage {
    cliente:any={};
    desglose:Array<any>=[];
    constructor(public nav:NavController, private api:Api,params:NavParams) {
        this.cliente = params.get("cliente");
        this.getCarteraPorCliente();
    }

    getCarteraPorCliente(){
        this.api.getCarteraPorCliente(this.cliente.COD_TER).then((data:any)=>{
            this.desglose = data.cliente;
        });
    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return "$ " + numero.format(2, 3, '.', ',') ;
    }

}
