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
var ListPage = (function () {
    function ListPage(nav, navParams, api) {
        this.nav = nav;
        this.api = api;
        this.api.getClientes().then(function (response) { console.log(response); api.clientes = response; });
    }
    ListPage.prototype.itemTapped = function (event, item) {
        this.api.setClienteSelected(item);
    };
    ListPage.prototype.seleccionado = function (cliente) {
        return (cliente && this.api.cliente && (this.api.cliente.id == cliente.id));
    };
    ListPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/list/list.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.NavParams, api_1.Api])
    ], ListPage);
    return ListPage;
})();
exports.ListPage = ListPage;
