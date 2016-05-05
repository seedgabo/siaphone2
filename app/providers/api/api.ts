import {Injectable} from 'angular2/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class Api {

    storage = new Storage(SqlStorage);
    data:any={};user:any={};empresas:any;empresa:any;clientes:any={};cliente:any;productos:Array<any>;

    constructor(public http: Http) {
        this.initVar();
    }

    /**
    * Inicializa las variables de la clase Api, extrayendolas de la memoria Sql
    * @method initVar
    * @return {null}
    */
    initVar(){
        this.storage.get("username").then( (data) => this.data.username = data );
        this.storage.get("password").then( (data) => this.data.password = data );
        this.storage.get("url").then( (data)      => this.data.url = data );
        this.storage.get("user").then((data)      => {this.user = data ? JSON.parse(data): undefined;});
        this.storage.get("empresas").then((data)  => {this.empresas = data ? JSON.parse(data): undefined;});
        this.storage.get("empresa").then( (data)  => {this.empresa = data ? JSON.parse(data): undefined;});
        this.storage.get("clientes").then( (data) => {this.clientes = data ? JSON.parse(data): undefined;});
        this.storage.get("cliente").then( (data) =>  {this.cliente = data ? JSON.parse(data): undefined;});
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
        let headers = new Headers();
        headers.append("Authorization","Basic " + btoa(this.data.username + ":" + this.data.password));
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
        let headers = new Headers();
        headers.append("Authorization","Basic " + btoa(this.data.username + ":" + this.data.password));
        return new Promise(resolve => {
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
        let headers = new Headers();
        headers.append("Authorization","Basic " + btoa(this.data.username + ":" + this.data.password));
        return new Promise(resolve => {
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
        let headers = new Headers();
        headers.append("Authorization","Basic " + btoa(this.data.username + ":" + this.data.password));

        return new Promise(resolve => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getProductos?page="+(p!= undefined ? p :-1), {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                // this.storage.set("productos",JSON.stringify(data));
                resolve(data);
            });
        });
    }

}