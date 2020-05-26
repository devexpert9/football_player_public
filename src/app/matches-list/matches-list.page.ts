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
declare var window: any; 
@Component({
  selector: 'app-matches-list',
  templateUrl: './matches-list.page.html',
  styleUrls: ['./matches-list.page.scss'],
})
export class MatchesListPage implements OnInit {
  title="My Matches";
  matches:any='all';
  public win: any = window; 
  response:any;
  imageURI: any;
  errors:any=['',null,undefined,'null','undefined'];
  image:any;
  url:any=config.API_URL+'server/data/match/';
  is_submit:any=false;
  filevar:any;
  _id:any=localStorage.getItem('_id');
  rate:any;
  onRateChange:any;
  presentModal:any;
  imgpath:any;
  imgblob:any;
  alldata:any=JSON.parse(localStorage.getItem('user'));
  second_form:any=false;  
  img_selected:any=false; 
  matchlist:any;
  upcominglist:any=[];
  upcomingres:any;
  previouslist:any=[];
  previousres:any;
  skeleton:any=[];
  response1_came:any=false;
  response2_came:any=false;
  t_hours:any
  constructor(
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
    public sanitizer:DomSanitizer 
  ) { 
    this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]; 

    this.events.subscribe('refresh', data => {
      this. ionViewDidEnter();
    })

  }

      ionViewDidEnter(){
        this._id = localStorage.getItem('_id');
        this.response1_came=false;
        this.response2_came=false;
        this.upcominglist=[];
        this.previouslist=[];
        this.upcomingMatches();
        this.previousMatches();
        this.getHoursOfPlay();

      }

 
  ngOnInit() {
  }

  upcomingMatches(){
    this.apiservice.post('playerUpMatches',{_id:this._id},'').subscribe((result) => { 
      this.response1_came=true;           
      this.upcomingres=result;
  if(this.upcomingres.status == 1){     
      console.log(this.upcomingres.data);
      this.upcominglist=this.upcomingres.data; 
     
  }
  else{
     
      // this.notifi.presentToast(this.upcomingres.msg,'danger');
  }
},
err => {
      this.response1_came=true;          
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error, Please try later','danger');
});

   }

   previousMatches(){
    this.apiservice.post('mypreviousMatches',{_id: this._id},'').subscribe((result) => {  
      this.response2_came=true;         
      this.notifi.stopLoading();              
      this.previousres=result;
  if(this.previousres.status == 1){
         this.previouslist=this.previousres.data;
   
     
  }
  else{
     
      // this.notifi.presentToast(this.previousres.msg,'danger');
  }
},
err => {
      this.response2_came=true;   
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error, Please try later','danger');
});

   }

   getHoursOfPlay(){
    this.apiservice.post('getHoursOfPlay',{_id:this._id},'').subscribe((result) => { 
      this.response1_came=true;           
     var res;
     res = result;
    
    this.t_hours = Math.round(res.hours)
     
     
  
},
err => {
      this.response1_came=true;          
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error, Please try later','danger');
});

   }

}
