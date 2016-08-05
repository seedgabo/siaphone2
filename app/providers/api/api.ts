import {Storage, SqlStorage} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class Api {

    storage = new Storage(SqlStorage);
    data:any={};user:any={};empresas:any;empresa:any;clientes:any={};cliente:any;productos:Array<any>;token:any;cartera:Array<any>;offline:boolean;

    constructor(public http: Http) {
        this.initVar();
        // this.storage.query("DROP TABLE carrito");
        this.storage.query('CREATE TABLE IF NOT EXISTS carrito (ID INTEGER PRIMARY KEY AUTOINCREMENT, NOM_REF TEXT, NOM_TER TEXT,empresa_id INTEGER, VAL_REF INTEGER, COD_REF TEXT, COD_CLI TEXT, cantidad INTEGER)');
    }

    /**
    * Inicializa las variables de la clase Api, extrayendolas de la memoria Sql
    * @method initVar
    * @return {null}
    */
    initVar(){
        this.storage.get("offline").then( (data) => {if(data == "true")  this.offline = true; else this.offline == false; });
        this.storage.get("username").then( (data) => this.data.username = data );
        this.storage.get("token").then( (data) => this.token = data );
        this.storage.get("password").then( (data) => this.data.password = data );
        this.storage.get("url").then( (data)      => this.data.url = data );
        this.storage.get("user").then((data)      => {this.user = data ? JSON.parse(data): undefined;});
        this.storage.get("empresas").then((data)  => {this.empresas = data ? JSON.parse(data): undefined;});
        this.storage.get("empresa").then( (data)  => {this.empresa = data ? JSON.parse(data): undefined;});
        this.storage.get("clientes").then( (data) => {this.clientes = data ? JSON.parse(data): undefined;});
        this.storage.get("cliente").then( (data) =>  {this.cliente = data ? JSON.parse(data): undefined;});
        this.storage.get("productos").then( (data) =>  {this.productos = data ? JSON.parse(data): undefined;});
        this.storage.get("cartera").then( (data) =>  {this.cartera = data ? JSON.parse(data): undefined;});
    }

    /**
    * Establecer los datos de inicio de sesión
    * @method setData
    * @param  {string} username nuevo valor del usuario o email
    * @param  {string} password nuevo valor de la contraseña
    * @param  {string} url      nuevo valor de la url de conexión
    * @return {null}
    */
    setData (username, password , url) {
        this.storage.set("username", username);
        this.storage.set("password", password);
        this.storage.set("url", url);
    };

    /**
    * Guarda el usuario selecionado en memoria
    * @method saveUser
    * @param  {Object} user Usuario a guardar
    * @return {null}
    */
    saveUser(user){
        this.storage.set("user",JSON.stringify(user));
    }

    /**
    * Establece la conexión con el sistema, si la conexión es correcta devuelve el objeto del usuario
    * @method doLogin
    * @return {Observable<Object>} Observable que devolvera el usuario del sistema;
    */
    doLogin(){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.get(this.data.url + "api/auth", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, error => resolve(error));
        });
    }

    /**
    * Obtiene las empresas disponibles para el usuario actual
    * @method getEmpresas
    * @return {Observable<Array>}  Array de Empresas disponibles
    */
    getEmpresas(){
        let headers= this.setHeaders();        return new Promise(resolve => {
            this.http.get(this.data.url + "api/getEmpresas", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                this.storage.set("empresas", JSON.stringify(data));
                resolve(data);
            });
        });
    }

    /**
    * Selecciona la empresa actual para la aplicación
    * @method setEmpresaSelected
    * @param  {Object}           empresa empresa a seleccionar
    * @return {null}
    */
    setEmpresaSelected(empresa){

        this.storage.set("empresa",empresa);
        this.empresa = empresa;
        this.cliente = null;
        console.log('Empresa '+ empresa + ' seleccionada');
    }

    /**
    * Obtiene los clientes para el usuario y empresa actual
    * @method getClientes
    * @return {Observable<Array>}  Observable que retorna el array de clientes
    */
    getClientes(){
        let headers= this.setHeaders();        return new Promise(resolve => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getClientes", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                this.storage.set("clientes",JSON.stringify(data));
                resolve(data);
            });
        });
    }


    /**
    * Selecciona el cliente actual de trabajo
    * @method setClienteSelected
    * @param  {cliente}           cliente Cliente a seleccionar
    * @return {null}
    */
    setClienteSelected(cliente){
        this.storage.set("cliente",JSON.stringify(cliente));
        this.cliente = cliente;
        console.log('Cliente ' + cliente.NOM_TER + 'seleccionado' );
    }

    /**
    * Obtiene los productos para la empresa actual
    * @method getProductos
    * @param  {number}     p Pagina actual a traer productos default: -1
    * @return {Promise}      promesa que devolvera el array de productos
    */
    getProductos(p?: number){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getProductos?page="+(p!= undefined ? p :-1), {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                this.storage.setJson("productos",data.data);
                resolve(data);
            });
        });
    }

    searchProducto(query){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/searchProducto?query="+ query, {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    findProducto(id){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.get(this.data.url + "api/producto/"+ id, {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    addToCart(producto,cantidad){
        let sql = `insert or replace into carrito (ID, NOM_REF, NOM_TER, empresa_id, VAL_REF,COD_REF, COD_CLI, cantidad) values (
            (select ID from carrito where COD_REF = "${producto.COD_REF}" and COD_CLI = "${this.cliente.COD_TER}"),
            "${producto.NOM_REF}",
            "${this.cliente.NOM_TER}",
            ${this.empresas[this.empresa].id},
            ${producto.VAL_REF},
            "${producto.COD_REF}",
            "${this.cliente.COD_TER}",
            ${cantidad}
        );`
        console.log(sql);
        return this.storage.query(sql);
    }

    getCarrito(){
        return this.storage.query(`SELECT * FROM carrito WHERE COD_CLI = "${this.cliente.COD_TER}"`);
    }

    sendCarrito(carrito){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.post(this.data.url + "api/"+ this.empresa +"/procesarCarrito", JSON.stringify(carrito) ,{headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    getCartera(){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getCartera", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                if( data.cartera)
                    this.storage.setJson("cartera",data.cartera);
                resolve(data);
            });
        });
    }

    getCarteraPorCliente(codigo){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getCartera/" + codigo , {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                if( data.cartera)
                resolve(data);
            });
        });
    }

    setHeaders(){
        let headers = new Headers();
        if(this.token == undefined)
            headers.append("Authorization","Basic " + btoa(this.data.username + ":" + this.data.password));
        else
            headers.append("Auth-Token", this.token);

        headers.append("Content-Type","application/json");
        return headers;
    }

    getDataOffline(){
        let headers= this.setHeaders();
        return new Promise(resolve => {
            this.http.get(this.data.url + "api/getDataOffline", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                this.clientes = data.clientes;
                this.productos = data.productos;
                this.empresas = data.empresas;
                this.storage.setJson("clientes", data.clientes);
                this.storage.setJson("productos", data.productos);
                this.storage.setJson("empresas", data.empresas);
                resolve(data);
            });
        });
    }
}
