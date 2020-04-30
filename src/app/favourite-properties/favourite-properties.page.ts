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
  selector: 'app-favourite-properties',
  templateUrl: './favourite-properties.page.html',
  styleUrls: ['./favourite-properties.page.scss'],
})
export class FavouritePropertiesPage implements OnInit {
  title="Favorite Matches";
 
  slideOptsOne = {
  initialSlide: 1,
  speed: 400,
  autoplay:true,
  loop: true

};

public win: any = window; 
response:any;
profileData: any;
IsLoggedIn: any = localStorage.getItem('isLoggedIn');
IsPasswordUpadte: any = false;
profileImage: any = null;
imageURI: any;
errors:any=['',null,undefined,'null','undefined',' '];
slideOpts:any;
fileUrl: any = null;
respData: any; 
userId:any; 
username:any;
imagedata:any;
allpics:boolean=false;
lastpic:any;
camerapic:boolean=false;
totalimages:any;
morethan9:boolean=false;
yes:boolean=false;
realemail='asdc';

firstname:any;
lastname:any;
email:any;
contact:any;
image:any;
propic:any;
profile:any;
url:any=config.API_URL+'server/data/match/';
is_submit:any=false;
filevar:any;
_id:any=localStorage.getItem('_id');
matches:any;
rate:any;
onRateChange:any;
presentModal:any;
imgpath:any;
imgblob:any;
alldata:any=JSON.parse(localStorage.getItem('user'));
second_form:any=false;  
img_selected:any=false; 
matchlist:any;
upcominglist:any;
upcomingres:any;
searchlist:any;
searchres:any;
searching:any=false;
keyword:any;
noresults:any=false;
favres:any;
favlist:any;
searchmatchres:any;
searchmatchlist:any;
getfavidsres:any;
getfavidlist:any;
norecords:any=false;
response_came:boolean=false;
skeleton:any;
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
     )  {     
             
      this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
        }

    ionViewDidEnter(){
      this.response_came=false; 
      this.favlist=[];
    
                       this.getfav(); 
                       this.getfavids();        
                     }


    ngOnInit() {
    }

 getfav(){  
      this.apiservice.post('p_getfav',{_id:this._id},'').subscribe((result) => { 
        this.response_came=true; 
        this.notifi.stopLoading();              
        this.favres=result;
      if(this.favres.status == 1){ 
      
        this.favlist=this.favres.data
        this.noresults= false;
        this.norecords=false;
   
        console.log(this.favlist);   
       
    }
    else{
       
        this.norecords=true;
    }
    },
    err => {
      this.response_came=true; 
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal server error, Please try later','danger');
    });

 }

 searchmatch(fav){  
  
  if(this.errors.indexOf(fav.target.value)==-1){
      this.searching=true;
      this.keyword=fav.target.value;
      this.apiservice.post('p_srchfav',{_id:this._id,keyword:fav.target.value},'').subscribe((result) => {  
      this.notifi.stopLoading(); 
      this.searchmatchres=result;
// searchmatchlist:any;            
    if(this.searchmatchres.status == 1){     
     
      this.favlist= this.searchmatchres.data;
      if(this.favlist.length==0){
        this.noresults= true;
      }else{
        this.noresults= false;
      }
      
    }
    else{
      this.noresults= true;
      this.favlist=[];
    }

},
  err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error, Please try later','danger');
  });
  }else{
   
    this.noresults= false;
    this.searching=false;
    this.getfav(); 


  }

 }

 addfav(match_id,i){ 

        this.apiservice.post('p_addfav',{_id:this._id,match_id:match_id,status:0},'').subscribe((result) => {  
        this.notifi.stopLoading();              
        this.searchres=result;
        if(this.searchres.status == 1){           
              
        this.favlist.splice(i, 1);
        if(this.favlist.length==0)  this.norecords= true;
        this.notifi.presentToast('Removed from favourite','danger'); 

          
        }
        else{         
            this.notifi.presentToast(this.searchres.msg,'danger');
        }
        },
        err => {
            this.notifi.stopLoading();
            this.notifi.presentToast('Internal server error, Please try later','danger');
        });
}

getfavids(){  
        this.apiservice.post('p_getfav',{_id:this._id},'').subscribe((result) => {  
        this.notifi.stopLoading();    
        this.getfavidsres= result   
        
      
        if(this.getfavidsres.status == 1){     
           
            this.getfavidlist=[];
            for(let key of this.getfavidsres.data ){
              this.getfavidlist.push(key._id);
            }
            console.log(this.getfavidlist);   
        }

        },
        err => {
            this.notifi.stopLoading();
            this.notifi.presentToast('Internal server error, Please try later','danger');
        });

 }



}
