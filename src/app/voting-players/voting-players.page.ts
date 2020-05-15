import { Component, ChangeDetectorRef, OnInit,} from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config';
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import {ModalController, NavParams} from '@ionic/angular'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
declare var window: any; 
@Component({
  selector: 'app-voting-players',
  templateUrl: './voting-players.page.html',
  styleUrls: ['./voting-players.page.scss'],
})
export class VotingPlayersPage implements OnInit {
  title="Players List";
  url:any=config.API_URL+'server/data/p_pics/';
  errors:any=['',null,undefined,'null','undefined'];
  _id:any=localStorage.getItem('_id');
  response:any;
  selected_player_id:any;
  playerlist:any=[];
  noplayerlist:boolean=false;
  skeleton:any;
  response_came:any;
  match_id:any;
  constructor(
    public modalController: ModalController,
     public router: Router,
    public actionSheetController: ActionSheetController, 
    public events: Events, 	
    public apiservice:ApiService,
    public notifi:NotiService,
    public sanitizer:DomSanitizer,
    private geolocation: Geolocation,
    public navParams:NavParams,
    public alertController: AlertController,
    public cd:ChangeDetectorRef
    
    ) { 

      this.match_id = this.navParams.get('match_id');
      
      this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
      setTimeout(()=>{

        this.selected_player_id = this.navParams.get('selected_player_id');
    
       },1000)
    
    }

    ngOnInit() {
    }

   ionViewDidEnter(){
    this.response_came = false;
    this.notifi.presentLoading();
    this.getPlayers();
   }


   async myDismiss(name, id) {  

   var data = {
    player_name: name,
    selected_player_id: id

   }

    await this.modalController.dismiss(data);

   
  }


  getPlayers(){
  
    this.apiservice.post('getJoinedPlayers',{match_id: this.match_id},'').subscribe((result) => {       
      this.notifi.stopLoading();      
      this.response_came=true;        
     var res;
     res= result;
            if(res.status == 1){     
              
                this.noplayerlist = false;
              
                this.playerlist = res.data;   
            }
            else{
              this.noplayerlist = true;
              this.playerlist = [];
                
            }
    },
    err => {
          this.notifi.stopLoading();
          this.notifi.presentToast('Internal server error. Try again','danger');
    });
 

   }
   
   /////get teams/////

    closeModal(){
     
        this.modalController.dismiss();

    }

}


