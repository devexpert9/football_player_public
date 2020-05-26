import { Component, ChangeDetectorRef } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {config} from './config'
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { ModalController } from '@ionic/angular';
import { NetworkErrorPage } from './network-error/network-error.page';
import { MenuController, Platform, Events } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from './services/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/tabs/tabs/home',
      icon: 'home',
	  icons:'icon-footbal-play'
    },
    {
      title: 'Matches List',
      url: '/tabs/tabs/matches-list',
      icon: 'list',
	    icons:'icon-match-list'
    },
    {
      title: 'My Profile',
      url: '/my-profile',
      icon: 'person',
	  icons:'icon-user-profiles'
    },
    {
      title: 'Notifications',
      url: 'notifications',
      icon: 'notifications',
	  icons:'icon-stadium'
    },
	{
      title: 'Following',
      url: 'following',
      icon: 'person-add',
	  icons:'person-add'
    },
    {
      title: 'Owners List',
      url: 'admins',
      icon: 'list',
	  icons:'list'
    },
    {
      title: 'Confirmations',
      url: 'confirmations',
      icon: 'checkbox',
	  icons:'checkbox'
    },
    {
      title: 'Team Invitations',
      url: 'team-invitations',
      icon: 'mail-unread',
	  icons:'mail-unread'
    },
  ];

  alldata:any=JSON.parse(localStorage.getItem('user'));
  url:any=config.API_URL+'server/data/p_pics/';
  propic:any;
  errors:any=['',null,undefined,'null','undefined'];
  logged_in:any=false;
  fname:any;
  lname:any;
  points:any;
  _id:any=localStorage.getItem('_id');
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events:Events,
    private Router:Router,
    private network: Network,
    public modalController: ModalController,
    private ref: ChangeDetectorRef,
    private menu: MenuController,
    private fcm: FCM,
    private geolocation: Geolocation,
    public apiservice:ApiService,

  ) {
    this.alldata =JSON.parse(localStorage.getItem('user'));
    if(this.errors.indexOf(this.alldata)==-1){
     this.propic=this.alldata.pic;
     this.fname=this.alldata.fname;
     this.lname= this.alldata.lname;
     this.logged_in=true;
    }
      this.initializeApp();

      this.events.subscribe('newdata', data => {
        var newdata= JSON.parse(data);
        this.fname =newdata.fname;
        this.lname = newdata.lname;
        this.propic = newdata.pic;
        this.ref.detectChanges();
       });
       
      this.events.subscribe('logged', data => {
      this.points='';
      this.propic=data;
      this.alldata=JSON.parse(localStorage.getItem('user'));
      this.getPlayerInfo(this.alldata._id);
      this.logged_in=true;
      this.fname= this.alldata.fname;
      this.lname= this.alldata.lname;
    });

    setTimeout(()=>{    
      this.getPlayerInfo(this._id);
 }, 3000);

   
     
  }
  
 
  initializeApp() {    
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#6b6b6b');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      setTimeout(()=>{    
        this.getPlayerInfo(this._id);
   }, 3000);


       this.fcm.onNotification().subscribe(data => {
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });
        let watch = this.geolocation.watchPosition();
        watch.subscribe((resp) => {
          this.apiservice.post('location_update',{_id:this._id,lat:resp.coords.latitude,lng:resp.coords.longitude},'').subscribe((result) => {



          });

         console.log(resp);

        });


      // this.network.onDisconnect().subscribe(() => {
      //   console.log('network was disconnected :-(');
      //   this.presentModal();
       
      // });

      // this.network.onConnect().subscribe(() => {
       
       
      //   setTimeout(() => {
      //     this.events.publish('connected','');
      //   }, 3000);
      // });

    });
  }

  logout(){ 
   
   localStorage.removeItem('user');
   localStorage.removeItem('logged_in');
   localStorage.removeItem('_id');
   this.closeMenu();
   var self = this;
   setTimeout(function(){
    self.logged_in=false;
    self.Router.navigate(['/login']);
  },500);  
 
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: NetworkErrorPage
    });
    return await modal.present();
  }

  closeMenu(){
    this.menu.close();
  }


  getPlayerInfo(_id){
    this.apiservice.post('playerAllInfo',{_id: _id},'').subscribe((result) => {  
      var res;
      res= result;
      this.points = res.points;
     

  },
  err => {
     
  });

  };

  

}
