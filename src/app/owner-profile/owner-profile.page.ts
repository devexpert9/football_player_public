import { ModalController } from '@ionic/angular';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera} from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config'
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import { RequestFieldComponent } from "../request-field/request-field.component";
import { RequestfieldmodalComponent } from "../requestfieldmodal/requestfieldmodal.component";
declare var window: any; 
@Component({
  selector: 'app-owner-profile',
  templateUrl: './owner-profile.page.html',
  styleUrls: ['./owner-profile.page.scss'],
})
export class OwnerProfilePage implements OnInit {
  title="Owner Profile";
    matches_list: any;
    owner_id:any;
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
    murl:any=config.API_URL+'server/data/match/';  
    _id:any=localStorage.getItem('_id');
    matches:any;
    imgpath:any;
    owner_details:any;
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

    owner_res:any;
    owner_array:any;

    upcoming_res:any;
    upcoming_array:any=[];

    previous_res:any;
    previous_array:any=[];

   follow_res:any;
   follow_array:any;

   getfollow_res:any;
   getfollow_array:any;

   following:any=false;

   noOfFollowers:any;
   skeleton:any=[];
   response1_came:any=false;
   response2_came:any=false;
   response3_came:any=false;
   response4_came:any=false;


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
    ) {     
      this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
      }

  ionViewDidEnter(){
    this.response1_came =false;
    this.response2_came =false;
    this.response3_came =false;
    this.response4_came =false;

    this.noOfFollowers='';
    this.matches_list = "upcoming";
    this.owner_id=this.ActivatedRoute.snapshot.paramMap.get('id');
    this.ownerdetails();
    this.upcomingMatches();
    this.mypreviousMatches();
    this.getfollow();

  }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: RequestfieldmodalComponent,
      componentProps: {
       'owner_id':this.owner_id
      }
    });
    return await modal.present();
  }
  dismiss() {  
      this.modalController.dismiss({
      'dismissed': true
    });
  }

  ownerdetails(){

              this.apiservice.post('ownerdetail',{owner_id:this.owner_id},'').subscribe((result) => {  
              this.response1_came =true;
              this.owner_res=result;
              if(this.owner_res.status == 1){     
              // this.notifi.presentToast(this.response.msg,'success'); 
              this.owner_array=this.owner_res.data;            
              }
              },
              err => {
              this.response1_came =true;
              this.notifi.stopLoading();
              this.notifi.presentToast('Internal error occured','danger');
              });

  }

  mypreviousMatches(){
              this.apiservice.post('mypreviousMatches',{_id:this.owner_id},'').subscribe((result) => {  
              this.response2_came =true;
              this.previous_res=result;
              if(this.previous_res.status == 1){     
              // this.notifi.presentToast(this.response.msg,'success'); 
              this.previous_array=this.previous_res.data;
             
              }

              },
              err => {
              this.response2_came =true;
              this.notifi.stopLoading();
              this.notifi.presentToast('Internal error occured','danger');
              });

}


upcomingMatches(){
            this.apiservice.post('myupcomingMatches',{_id:this.owner_id},'').subscribe((result) => {  
                this.response3_came =true;
                this.notifi.stopLoading();  
                this.upcoming_res=result;
                if(this.upcoming_res.status == 1){     
                
                this.upcoming_array=this.upcoming_res.data;
              


                }
                else{
                // this.notifi.presentToast(this.upcoming_res.msg,'danger');
                }
            },
            err => {
                this.response3_came =true;
                this.notifi.stopLoading();
                this.notifi.presentToast('Internal error occured','danger');
            });

}


follow()
{
  this.notifi.presentLoading();  
   var status;
  if(this.following==true){
    status=0; 

  }else{

    status=1; 
  }

  this.apiservice.post('followOwner',{_id:this._id, owner_id:this.owner_id, status:status},'').subscribe((result) => {  
      this.notifi.stopLoading();   
      this.follow_res=result;
      if(this.follow_res.status == 1){     
      
        
        if(this.following==true){
       if(this.errors.indexOf(this.noOfFollowers)>=0) this.noOfFollowers=0;
       else{
        this.noOfFollowers--;
       }   
       this.following=false;
       
      
        }else{
          this.noOfFollowers++;
          this.following=true;
        }
     


      }
      else{
      // this.notifi.presentToast(this.follow_res.msg,'danger');
      }
  },
  err => {
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured','danger');
  });

}


getfollow(){
  this.apiservice.post('getfollowOwner',{_id:this._id},'').subscribe((result) => {
      this.response4_came =true;  
      this.notifi.stopLoading();  
      this.getfollow_res=result;   
      console.log( this.getfollow_res);  

      if(this.getfollow_res.status == 1){ 
        var ids=[];
        var i=0;
        for(let key of this.getfollow_res.data){
          ids.push(key._id);
          i++;
        }  
        
        if(i==this.getfollow_res.data.length){
          this.noOfFollowers=this.getfollow_res.data.length;
        }


      if(ids.indexOf(this.owner_id)>=0) this.following=true;
      else this.following=false        

      }
      else{
     this.getfollow_array='';
     this.noOfFollowers=0;
      }
  },
  err => {
      this.response4_came =true;
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal error occured','danger');
  });

}

}
