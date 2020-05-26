import { ModalController } from '@ionic/angular';
import { FeespayComponent  } from "../feespay/feespay.component";
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config'
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
declare var window: any; 

@Component({
  selector: 'app-previous-matchdetails',
  templateUrl: './previous-matchdetails.page.html',
  styleUrls: ['./previous-matchdetails.page.scss'],
})
export class PreviousMatchdetailsPage implements OnInit {
          title:any;
          public win: any = window; 
          response:any;
          errors:any=['',null,undefined,'null','undefined'];
          slideOpts:any;
          fileUrl: any = null;
          respData: any; 
          userId:any; 
          username:any;
          imagedata:any; 
          url:any=config.API_URL+'server/data/pic/';  
          purl:any=config.API_URL+'server/data/p_pics/';  
          _id:any=localStorage.getItem('_id');
          matches:any;
          imgpath:any;
          matchlist:any;
          upcominglist:any;
          upcomingres:any;
          searchlist:any;
          searchres:any;
          searching:any=false;
          keyword:any;
          noresults:any=false;
          favres:any;
          favlist:any=[];
          match_id:any;
          getjoinres:any;
          getjoinresult:any=[];
          noOfPlayers:any=0;
          indexArray:any=[];
          alldata:any=JSON.parse(localStorage.getItem('user'));
          onlyplayers:any=[];
          owner_id:any;
          response1_came:any=false;
          response2_came:any=false;
          skeleton:any=[];
          team_1:any;
          team_2:any;
          team_1_players:any;
          team_2_players:any;
          team_3_players:any;
          constructor(
          public modalController: ModalController,
          private filePath: FilePath,
          private transfer: FileTransfer,
          private file: File,
          private camera: Camera,
          private ref: ChangeDetectorRef,    
          public TransferObject:FileTransferObject,
          public router: Router,
          public actionSheetController: ActionSheetController, 
          public events: Events,   
          private platform: Platform,
          public apiservice:ApiService,
          public notifi:NotiService,
          public sanitizer:DomSanitizer,
          public ActivatedRoute:ActivatedRoute
    ){
      this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
       this.match_id= this.ActivatedRoute.snapshot.paramMap.get('id');
 

      }

       ionViewDidEnter(){
         this._id = localStorage.getItem('_id');
         this.team_1_players =[];
        this.response2_came=false; 
        this.response1_came=false; 
        this.getjoinresult=[];
        this.matchdetail();
        this.getJoinMatch();

       }
  ngOnInit() {
  }

  
  async presentModal() {   
          const modal = await this.modalController.create({
          component: FeespayComponent,
          componentProps: {
          'match_id': this.match_id,
          'player_id':this._id,
          'owner_id':this.owner_id
          
            }
    });

    modal.onDidDismiss().then((detail) => {
     console.log(detail)
      if(detail.data==1){
        this.joinMatch();
      }

    });

    
    return await modal.present();  
  }

  joinMatch(){

    this.notifi.presentLoading();  
    this.apiservice.post('Joinmatch',{_id:this._id,match_id:this.match_id,status:1},'').subscribe((result) => {  
      this.notifi.stopLoading();  
      this.respData= result;
     if(this.respData.status == 1){
      this.noOfPlayers++;  
      this.getjoinresult.push(this._id);
      this.team_3_players.push({
        pic:this.alldata.pic,
        fname:this.alldata.fname,
        lname:this.alldata.lname,
        position:this.alldata.position,
        goals:this.alldata.goals,

      });
      this.notifi.presentToast(this.respData.msg,'success');

      }  

      },
      err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal error occured','danger');
      });



  }

  leaveMatch(){

    this.notifi.presentLoading();  
    this.apiservice.post('Joinmatch',{_id:this._id,match_id:this.match_id,status:0},'').subscribe((result) => {  
      this.notifi.stopLoading();  
      this.respData= result;
     if(this.respData.status == 1){
      this.noOfPlayers--;       
      var index = this.getjoinresult.indexOf(this._id); 
      this.getjoinresult.splice(index, 1);
      this.team_3_players.splice(index, 1);    

      }else{

        this.notifi.presentToast(this.respData.msg,'danger');
      }  

      },
      err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal error occured','danger');
      });



  }
  
  dismiss() {
      this.modalController.dismiss({
      'dismissed': true
      });
      }

  matchdetail(){

          this.apiservice.post('p_matchdetails',{match_id:this.match_id},'').subscribe((result) => {  
            this.response1_came=true; 
            this.notifi.stopLoading();
            this.response=result;
          if(this.response.status == 1){     
          // this.notifi.presentToast(this.response.msg,'success'); 
          this.matchlist=this.response;
          this.owner_id= this.response.owner._id; 
         this.team_1 = this.matchlist.match.team1
         this.team_2 = this.matchlist.match.team2
          this.title= this.matchlist.match.team1+' VS '+this.matchlist.match.team2
          console.log(this.matchlist);
          }
   
          },
          err => {
          this.response1_came=true; 
          this.notifi.stopLoading();
          this.notifi.presentToast('Internal error occured','danger');
          });

        }

  getJoinMatch(){ 
   
        this.apiservice.post('newGetJoinmatch',{match_id:this.match_id,_id:this._id},'').subscribe((result) => { 
          this.response2_came=true; 
        this.notifi.stopLoading();  
        this.getjoinres=result;
        console.log(this.getjoinres);
      
        if(this.getjoinres.status == 1){   

          this.team_1_players = this.getjoinres.players1
          this.team_2_players = this.getjoinres.players2
          this.team_3_players = this.getjoinres.players3
           this.getjoinresult = this.getjoinres.players
           this.noOfPlayers= this.getjoinresult.length;
         
        }else{
          this.getjoinresult=[];
          this.noOfPlayers= 0;
        }

        },
        err => {
           this.response2_came=true; 
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured','danger');
        });

            }

            count(p){
             console.log(p)
              return p
            }

}
