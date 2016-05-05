var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var api_1 = require("../../providers/api/api");
var HelloIonicPage = (function () {
    function HelloIonicPage(api, nav) {
        this.empresas = [];
        this.api = api;
        this.nav = nav;
        this.username = this.api.data;
    }
    HelloIonicPage.prototype.doLogin = function () {
        var _this = this;
        var loading = ionic_angular_1.Loading.create({ content: "Iniciando Sesión", duration: 10000 });
        this.nav.present(loading);
        this.api.doLogin().then(function (data) {
            if (data.status) {
                var alert_1 = ionic_angular_1.Alert.create({
                    title: 'Error ' + data.status,
                    subTitle: data._body,
                    buttons: ['OK']
                });
                loading.dismiss();
                _this.nav.present(alert_1);
                return;
            }
            _this.api.setData(_this.username.username, _this.username.password, _this.username.url);
            _this.api.user = data;
            _this.api.saveUser(data);
            loading.dismiss();
            _this.getEmpresas();
        });
    };
    ;
    HelloIonicPage.prototype.getEmpresas = function () {
        var _this = this;
        this.api.getEmpresas().then(function (data) {
            console.log(data);
            _this.api.empresas = data;
        });
    };
    ;
    HelloIonicPage.prototype.getClientes = function () {
        this.api.getClientes().then(function (data) {
            console.log(data);
        });
    };
    HelloIonicPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
        }), 
        __metadata('design:paramtypes', [api_1.Api, ionic_angular_1.NavController])
    ], HelloIonicPage);
    return HelloIonicPage;
})();
exports.HelloIonicPage = HelloIonicPage;
