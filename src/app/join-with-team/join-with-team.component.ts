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
  selector: 'app-join-with-team',
  templateUrl: './join-with-team.component.html',
  styleUrls: ['./join-with-team.component.scss'],
})
export class JoinWithTeamComponent implements OnInit {
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
  ids:any =[];
  team_name:any;
  limit:any;
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

       this.ids = this.navParams.get('player_ids');
       this.limit = this.navParams.get('limit');
      
      this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
      setTimeout(()=>{
       
        this.selected_player_id = this.navParams.get('player_ids');

         this.getPlayers();
    
       },1000)

     
    
    }

    ngOnInit() {
    }

   ionViewDidEnter(){
    this._id = localStorage.getItem('_id');
    this.playerlist=[];
    this.response_came = false;
   }


   async myDismiss(status) { 
   var data 
   if(status ==1){

  data = {
    ids: this.ids,
    status : 1
   }
   }else{
   this.ids= [];
   this.selected_player_id  = [];

  data = {
  
    ids: [],
    status : 0

   }


   } 

    await this.modalController.dismiss(data);
 
  }


  getPlayers(){
  
   this.apiservice.post('getTeamInfo',{_id: this._id},'').subscribe((result) => {       
      this.notifi.stopLoading();   
      this.response_came = true;           
     var res;
     res= result;
            if(res.status == 1){     

                this.team_name = res.team_name
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

    FieldsChange(values:any,id){
  
      if(values.target.checked){                       
        if(this.ids.length<this.limit){
   console.log('this.ids.length', this.ids.length)  
      console.log('this.limit', this.limit)  
          this.ids.push(id);
  
        }
         
      }else{
        var index= this.ids.indexOf(id);
        this.ids.splice(index, 1);
      } 


      }

 

}


