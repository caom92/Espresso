import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { BackendService } from '../services/app.backend';
import { EditProfile } from '../pages/edit-profile/edit-profile';

@Component({
  templateUrl: 'app.html',
  providers: [
    BackendService
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;

  pages: Array<{title: string, component: any, icon: string}>;
  adminPages: Array<{title: string, component: any, icon: string}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, public menuCtrl: MenuController, private server: BackendService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Editar Perfil', component: EditProfile, icon: "contact" }
    ];

    this.adminPages = [
      { title: 'Usuarios', component: HomePage, icon: "people" },
      { title: 'Zonas', component: HomePage, icon: "map" },
      { title: 'Programas', component: HomePage, icon: "copy" },
      { title: 'Supervisores', component: HomePage, icon: "medal" },
      { title: 'Firmas', component: HomePage, icon: "create" }
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    /*if(page.component == EditProfile && false){
      this.nav.setRoot(page.component)
    } else {*/
      this.nav.push(page.component)
    /*}*/
  }

  closeSession(){
    this.server.update(
      'logout', 
      new FormData(), 
      (response: any) => {
        if (result.meta.return_code == 0) {
          // si la sesion fue cerrada correctamente, desactivamos la bandera y 
          // redireccionamos al usuario a la pantalla de inicio de sesion
          //localStorage.is_logged_in = false
          //this.home.hideZoneMenu()
          //this.router.go('login')
          this.storage.clear()
          this.nav.setRoot(HomePage)
          this.menuCtrl.enable(false)
        } else {
          // si hubo un problema con la comunicacion con el servidor, 
          // desplegamos un mensaje de error al usuario
          //this.toastManager.showServiceErrorText('check-session', result.meta)
        }
      }
    )
  }

  isAdmin(){
    return localStorage["__mydb/_ionickv/role_name"] == '"Administrator"';
  }
}

