import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Api} from '../../providers/api/api';
declare var Number:any;
@Component({
    templateUrl: 'build/pages/cartera-por-cliente/cartera-por-cliente.html',
})

export class CarteraPorClientePage {
    cliente:any={};
    desglose:Array<any>=[];
    constructor(public nav:NavController, private api:Api,params:NavParams) {
        this.cliente = params.get("cliente");
        this.getCarteraPorCliente();
        this.api.storage.get("cartera-" + this.cliente.COD_TER).then((data:any) =>{
             if(data)
                this.desglose = JSON.parse(data);
        });
    }

    getCarteraPorCliente(){
        this.api.getCarteraPorCliente(this.cliente.COD_TER).then((data:any)=>{
            this.desglose = data.cliente;
            this.api.storage.set("cartera-" + this.cliente.COD_TER , JSON.stringify(data.cliente));
        });
    }

    toCurrency(number:string){
        let numero=  Number.parseFloat(number);
        return "$ " + numero.format(2, 3, '.', ',') ;
    }

}
