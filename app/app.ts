import {ViewChild,Component} from '@angular/core';
import {ionicBootstrap,Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
import {ProductosPage} from './pages/productos/productos';
import {CarritoPage} from './pages/carrito/carrito';
import {Api}  from './providers/api/api';
import {ImageManager} from "./providers/image-manager/image-manager";

@Component({
    templateUrl: 'build/app.html'
})
class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage = HelloIonicPage;
    pages: Array<{title: string, component: any, icon:string, primary?:boolean, secondary?:boolean, danger?:boolean, disabled?:boolean}>;
    constructor(private platform: Platform,private api:Api) {
        this.api= api;
        this.initializeApp();
        this.pages = [
            { title: 'Home', component: HelloIonicPage, icon:"home" , primary:true},
            { title: 'Clientes', component: ListPage , icon : "people", primary:true},
            { title: 'Catalogo', component: ProductosPage , icon : "pricetags", primary:true, disabled: true},
            { title: 'Carrito', component: CarritoPage , icon : "cart", primary:true, disabled: true},
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            StatusBar.styleDefault();
        });
    }

    openPage(page) {
        this.nav.root = (page.component);
    }
}

ionicBootstrap(MyApp, [Api,ImageManager], {});

Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
