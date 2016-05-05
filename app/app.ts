import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
import {ProductosPage} from './pages/productos/productos';
import {Api} from "./providers/api/api";
@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [Api]
})
class MyApp {

  rootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any, icon:string, primary?:boolean, secondary?:boolean, danger?:boolean, warning?:boolean, light?:boolean}>;

  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController,
    public api:Api
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HelloIonicPage, icon:"home" , primary:true},
      { title: 'Clientes', component: ListPage , icon : "people", secondary:true},
      { title: 'Catalogo', component: ProductosPage , icon : "cart", warning:true},
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
