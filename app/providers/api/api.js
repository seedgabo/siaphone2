var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var ionic_angular_1 = require('ionic-angular');
var http_1 = require('angular2/http');
require('rxjs/add/operator/map');
var Api = (function () {
    function Api(http) {
        this.http = http;
        this.storage = new ionic_angular_1.Storage(ionic_angular_1.SqlStorage);
        this.data = {};
        this.user = {};
        this.clientes = {};
        this.initVar();
    }
    /**
    * Inicializa las variables de la clase Api, extrayendolas de la memoria Sql
    * @method initVar
    * @return {null}
    */
    Api.prototype.initVar = function () {
        var _this = this;
        this.storage.get("username").then(function (data) { return _this.data.username = data; });
        this.storage.get("password").then(function (data) { return _this.data.password = data; });
        this.storage.get("url").then(function (data) { return _this.data.url = data; });
        this.storage.get("user").then(function (data) { _this.user = data ? JSON.parse(data) : undefined; });
        this.storage.get("empresas").then(function (data) { _this.empresas = data ? JSON.parse(data) : undefined; });
        this.storage.get("empresa").then(function (data) { _this.empresa = data ? JSON.parse(data) : undefined; });
        this.storage.get("clientes").then(function (data) { _this.clientes = data ? JSON.parse(data) : undefined; });
        this.storage.get("cliente").then(function (data) { _this.cliente = data ? JSON.parse(data) : undefined; });
    };
    /**
    * Establecer los datos de inicio de sesión
    * @method setData
    * @param  {string} username nuevo valor del usuario o email
    * @param  {string} password nuevo valor de la contraseña
    * @param  {string} url      nuevo valor de la url de conexión
    * @return {null}
    */
    Api.prototype.setData = function (username, password, url) {
        this.storage.set("username", username);
        this.storage.set("password", password);
        this.storage.set("url", url);
    };
    ;
    /**
    * Guarda el usuario selecionado en memoria
    * @method saveUser
    * @param  {Object} user Usuario a guardar
    * @return {null}
    */
    Api.prototype.saveUser = function (user) {
        this.storage.set("user", JSON.stringify(user));
    };
    /**
    * Establece la conexión con el sistema, si la conexión es correcta devuelve el objeto del usuario
    * @method doLogin
    * @return {Observable<Object>} Observable que devolvera el usuario del sistema;
    */
    Api.prototype.doLogin = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("Authorization", "Basic " + btoa(this.data.username + ":" + this.data.password));
        return new Promise(function (resolve) {
            _this.http.get(_this.data.url + "api/auth", { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            }, function (error) { return resolve(error); });
        });
    };
    /**
    * Obtiene las empresas disponibles para el usuario actual
    * @method getEmpresas
    * @return {Observable<Array>}  Array de Empresas disponibles
    */
    Api.prototype.getEmpresas = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("Authorization", "Basic " + btoa(this.data.username + ":" + this.data.password));
        return new Promise(function (resolve) {
            _this.http.get(_this.data.url + "api/getEmpresas", { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.storage.set("empresas", JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
    * Selecciona la empresa actual para la aplicación
    * @method setEmpresaSelected
    * @param  {Object}           empresa empresa a seleccionar
    * @return {null}
    */
    Api.prototype.setEmpresaSelected = function (empresa) {
        this.storage.set("empresa", empresa);
        this.empresa = empresa;
        this.cliente = null;
        console.log('Empresa ' + empresa + ' seleccionada');
    };
    /**
    * Obtiene los clientes para el usuario y empresa actual
    * @method getClientes
    * @return {Observable<Array>}  Observable que retorna el array de clientes
    */
    Api.prototype.getClientes = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("Authorization", "Basic " + btoa(this.data.username + ":" + this.data.password));
        return new Promise(function (resolve) {
            _this.http.get(_this.data.url + "api/" + _this.empresa + "/getClientes", { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.storage.set("clientes", JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
    * Selecciona el cliente actual de trabajo
    * @method setClienteSelected
    * @param  {cliente}           cliente Cliente a seleccionar
    * @return {null}
    */
    Api.prototype.setClienteSelected = function (cliente) {
        this.storage.set("cliente", JSON.stringify(cliente));
        this.cliente = cliente;
        console.log('Cliente ' + cliente.NOM_TER + 'seleccionado');
    };
    /**
    * Obtiene los productos para la empresa actual
    * @method getProductos
    * @param  {number}     p Pagina actual a traer productos default: -1
    * @return {Promise}      promesa que devolvera el array de productos
    */
    Api.prototype.getProductos = function (p) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("Authorization", "Basic " + btoa(this.data.username + ":" + this.data.password));
        return new Promise(function (resolve) {
            _this.http.get(_this.data.url + "api/" + _this.empresa + "/getProductos?page=" + (p != undefined ? p : -1), { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // this.storage.set("productos",JSON.stringify(data));
                resolve(data);
            });
        });
    };
    Api = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Api);
    return Api;
})();
exports.Api = Api;
