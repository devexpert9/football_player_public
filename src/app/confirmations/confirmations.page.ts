import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CancelmatchComponent } from '../cancelmatch/cancelmatch.component';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
 import {NotiService } from '../services/noti/noti.service'; 
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any; 
import { SelectFavComponent } from '../select-fav/select-fav.component';
import {config} from '../config'
import { FeespayComponent  } from "../feespay/feespay.component";
@Component({ 
  selector: 'app-confirmations',
  templateUrl: './confirmations.page.html',
  styleUrls: ['./confirmations.page.scss'],
})
export class ConfirmationsPage implements OnInit {
title="Confirmations";
requestsRes:any;
requestslist:any;
norequest:any;
_id:any;
errors:any=['',null,undefined,'null','undefined'];
url:any=config.API_URL+'server/data/match/';
actionres:any;
response_came:boolean=false;
skeleton:any;
match_id:any;
owner_id:any
  constructor(
      public modalController: ModalController,
      public router: Router,    
      public apiservice:ApiService,
      public notifi:NotiService,
      public sanitizer:DomSanitizer) { 
     this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
      }

      ionViewDidEnter(){
        this.requestslist =[];
        this.norequest=false;
        this.response_came=false;            
        this._id =localStorage.getItem('_id');
        this.getRequests();
      }

  ngOnInit() {
  }
	async presentModal2(_id,s,i) {
    const modal = await this.modalController.create({
      component: CancelmatchComponent,
      componentProps: {
        _id:_id
      }

    });

    modal.onDidDismiss().then((result)=>{
      if(result.data==1){
  
        this.requestslist.splice(i, 1);
        
      }
      
    });

    return await modal.present();
  }

  getRequests(){
    this.apiservice.post('getConfirmations',{_id:this._id},'').subscribe((result) => {
    this.response_came=true;    
      this.notifi.stopLoading();              
      this.requestsRes=result;
  if(this.requestsRes.status == 1){     
      // this.notifi.presentToast(this.response.msg,'success'); 
      this.requestslist=this.requestsRes.data;
      console.log(this.requestslist);
   
     
  }
  else{
    this.norequest=true;
      
  }
},
err => {
      this.response_came=true;  
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error. Try again','danger');
});

   }

   actionOnFieldReq(match_id,status,i,confirm_id){

    this.notifi.presentLoading();   
      this.apiservice.post('ConfirmAvailabilty',{match_id:match_id, status:status,_id:this._id,confirm_id:confirm_id},'').subscribe((result) => {  
      this.notifi.stopLoading();   
      
      console.log(result);
      this.actionres=result;
  if(this.actionres.status == 1){ 

    this.requestslist.splice(i, 1); 
    if(this.requestslist.length==0){
      this.norequest=true;

    }
    if(status==1){
      this.notifi.presentToast('Availability is confirmed','success');  
    }else{
      this.notifi.presentToast('Availability is declined','success');  
    } 
         
  }
},
err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error. Try again','danger');
});

   }
 

}
