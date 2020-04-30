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
import { SelectFavComponent } from "../select-fav/select-fav.component";
declare var window: any; 


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  title="Notifications";
  _id:any=localStorage.getItem('_id');
  notiArray:any;
  notires:any;
  purl:any=config.API_URL+'server/data/pic/';  
  response_came:boolean=false;
  errors:any=['',null,undefined,'null','undefined'];
  skeleton:any;
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

  ngOnInit() {
  }

    ionViewDidEnter(){
      this.response_came=false;  
    this.getJoinMatch();

  }


          getJoinMatch(){ 
    
        this.apiservice.post('get_player_notifications',{_id:this._id},'').subscribe((result) => { 
        this.notifi.stopLoading();  
        this.notires=result;
        console.log(this.notires);
      
        if(this.notires.status == 1){ 
          this.response_came=true;  
          this.notiArray=this.notires.data;
         
        }else{
          this.response_came=true;  
          this.notiArray=[];
         
        }

        },
        err => {
          this.response_came=true;  
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured','danger');
        });

            }

            clear(_id,i){

              this.apiservice.post('clear_player_notifications',{_id:_id},'').subscribe((result) => {  
                this.notifi.stopLoading();   
                this.notiArray
                console.log(result);
              var res;
              res=result;                
            if(res.status == 1){          
              this.notiArray.splice(i, 1);                  
            }
          },
          err => {
                this.notifi.stopLoading();
                this.notifi.presentToast('Internal server error. Try again','danger');
          });
                
          
             }
}
