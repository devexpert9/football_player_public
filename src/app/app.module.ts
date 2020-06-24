import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SelectFavComponent } from "./select-fav/select-fav.component";
import { CancelbookingComponent } from "./cancelbooking/cancelbooking.component";
import { CancelmatchComponent } from "./cancelmatch/cancelmatch.component";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera} from '@ionic-native/camera/ngx';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { Network } from '@ionic-native/network/ngx';
import { NetworkErrorPageModule } from './network-error/network-error.module';
import { Stripe } from '@ionic-native/stripe/ngx';
import { RequestfieldmodalComponent } from "./requestfieldmodal/requestfieldmodal.component";
import { FCM } from '@ionic-native/fcm/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
import { VotingPlayersPage } from './voting-players/voting-players.page';
import { SelectPlayersFromTeamPage } from './select-players-from-team/select-players-from-team.page';
import { PopupPlayersPage } from './popup-players/popup-players.page';
import { JoinWithTeamComponent } from './join-with-team/join-with-team.component';
import { NgxStarsModule } from 'ngx-stars';
import { socket_config, social_config } from './config';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { Calendar } from '@ionic-native/calendar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Toast } from '@ionic-native/toast/ngx';
const config: SocketIoConfig = { url: socket_config.SOCKET_URL, options: {} };
@NgModule({
  declarations: [PopupPlayersPage, SelectPlayersFromTeamPage, VotingPlayersPage,AppComponent , SelectFavComponent , CancelbookingComponent , CancelmatchComponent, RequestfieldmodalComponent,JoinWithTeamComponent],
  entryComponents: [PopupPlayersPage, SelectPlayersFromTeamPage, VotingPlayersPage,SelectFavComponent , CancelbookingComponent , CancelmatchComponent, RequestfieldmodalComponent, JoinWithTeamComponent],
  imports: [
    NgxStarsModule,
    Ng4GeoautocompleteModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,  
    ReactiveFormsModule,
    NetworkErrorPageModule,
    SocketIoModule.forRoot(config)
  
  ],
  providers: [  
  Toast,
  LocalNotifications, 
    Calendar,
    StatusBar,
    HttpClient,
    Stripe,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileTransfer,
    FileTransferObject,
    File,
    FilePath,
    Camera,
    Geolocation,
    FCM,
    Network,
    AlertController
     
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
