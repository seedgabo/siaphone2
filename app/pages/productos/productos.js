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
var ionic_native_1 = require('ionic-native');
var item_details_1 = require("../item-details/item-details");
var list_1 = require("../list/list");
var ProductosPage = (function () {
    function ProductosPage(nav, api) {
        var _this = this;
        this.nav = nav;
        this.actualPage = 1;
        this.api = api;
        this.nav = nav;
        if (!this.api.cliente) {
            ionic_native_1.Toast.showLongBottom("Seleccione un cliente primero").subscribe(function (toast) { });
            this.nav.setRoot(list_1.ListPage);
        }
        this.api.productos = [];
        this.api.getProductos(this.actualPage).then(function (response) { _this.api.productos = _this.api.productos.concat(response); _this.actualPage++; });
    }
    ProductosPage.prototype.verProducto = function (producto) {
        this.nav.push(item_details_1.ItemDetailsPage, { producto: producto });
    };
    ProductosPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.api.getProductos(this.actualPage).then(function (response) {
            _this.api.productos = _this.api.productos.concat(response);
            _this.actualPage++;
            console.log(_this.api.productos.length);
            infiniteScroll.complete();
        });
    };
    ProductosPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/productos/productos.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, api_1.Api])
    ], ProductosPage);
    return ProductosPage;
})();
exports.ProductosPage = ProductosPage;
