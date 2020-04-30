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
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  title="All Transactions";
  transactions:any;
  _id:any=localStorage.getItem('_id');
  response:any;
  no_details:boolean=false;
  errors:any=['',null,undefined,0];
  response_came:boolean=false;
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

  ) {   this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.response_came=false;
    this._id= localStorage.getItem('_id');
    this.no_details=false;
    this.transactions=[];
    this.transactions_details();

  }

  transactions_details(){   
    this.apiservice.post('transaction_details',{_id:this._id},'').subscribe((result) => {  
      this.response_came=true;
     this.response=result;
    if(this.response.status == 1){
      this.transactions= this.response.data; 
      setTimeout(()=>{

   this.notifi.stopLoading();


      },1000);     
 

    } else{ 
      this.response_came=true; 
      this.notifi.stopLoading();   
      this.transactions= []; 
    
        }
    

    },
    err => {
      this.response_came=true;
    this.notifi.stopLoading();
    this.notifi.presentToast('Internal error occured','danger');
    });

  }
}
