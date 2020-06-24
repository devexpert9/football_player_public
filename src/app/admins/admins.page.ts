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
  selector: 'app-admins',
  templateUrl: './admins.page.html',
  styleUrls: ['./admins.page.scss'],
})
export class AdminsPage implements OnInit {
  title_1:any='Facility List'
  url:any=config.API_URL+'server/data/property/';  
  _id:any=localStorage.getItem('_id');
  followres:any;
  followArray:any;
  errors:any=['',null,undefined,'null','undefined'];
  follow_res:any;
  nodata:any=false;
  keyword:any;
  searching:any=false
  searchres:any;
  noresults:any=false;
  response_came:boolean=false;
  skeleton:any;
  searcherror:any;
  noFollower:any;
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

  ) {   this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]}
	title="Following List";  
  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this._id=localStorage.getItem('_id');
    this.followArray =[];
    this.response_came=false;    
    this.getfollowers();
     
    }

    getfollowers(){
      this.apiservice.post('getAllOwners',{_id:this._id},'').subscribe((result) => { 
          
          this.notifi.stopLoading();  
          this.followres=result;
          if(this.followres.status == 1){
            this.response_came=true;     
            this.noresults= false;
          this.followArray=this.followres.data;
          console.log(this.followArray);


          }
          else if(this.followres.status == 0){
            this.response_came=true; 
            this.nodata=true;
            this.noFollower =true;
          
          }
      },
      err => {
        this.response_came=true; 
          this.notifi.stopLoading();
         this.notifi.presentToast('Internal error occured','danger');
      });

   }


follownow(id,i){
  this.notifi.presentLoading();
  this.apiservice.post('followOwner',{_id:this._id, owner_id:id, status:1},'').subscribe((result) => {  
      this.notifi.stopLoading();   
      this.follow_res=result;
      if(this.follow_res.status == 1){  
       
        this.followArray.splice(i,1);
        if(this.followArray.length==0) this.nodata=true;

      } 
      else{
      this.notifi.presentToast(this.follow_res.msg,'danger');
      }
  },
  err => {
      this.notifi.stopLoading();
    this.notifi.presentToast('Internal error occured','danger');
  });

}


search(ev){
 
  if(this.errors.indexOf(ev.target.value)==-1){
      this.keyword=ev.target.value;
      this.searching=true;
      this.apiservice.post('searchNonfollowOwner',{_id:this._id,keyword:ev.target.value},'').subscribe((result) => {  
          this.notifi.stopLoading();              
          this.searchres=result;
          if(this.searchres.status == 1){     

            this.followArray = this.searchres.data;
            
              if(this.followArray.length==0){
              this.noresults= true;
              }else{
              this.noresults= false;
              } 

          }else{
            this.noresults =true;
            this.searcherror =true;
            this.followArray =[];
          }
    
      },
      err => {
            this.notifi.stopLoading();
            this.notifi.presentToast('Internal error occured','danger');
      });

  }else{
          this.noresults= false;
          this.searching=false;            
          this.getfollowers();

  }               
       
 }

}
