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
@Component({
  selector: 'app-team-invitations',
  templateUrl: './team-invitations.page.html',
  styleUrls: ['./team-invitations.page.scss'],
})
export class TeamInvitationsPage implements OnInit {
title="Match Invitations";
requestsRes:any;
requestslist:any;
norequest:any;
_id:any;
errors:any=['',null,undefined,'null','undefined'];
url:any=config.API_URL+'server/data/p_pics/';
team_url:any=config.API_URL+'server/data/team/';
actionres:any;
response_came:boolean=false;
skeleton:any;
  constructor(
      public modalController: ModalController,
      public router: Router,    
      public apiservice:ApiService,
      public notifi:NotiService,
      public sanitizer:DomSanitizer) { 
     this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,6,5,4,2,3,4,5,6,7,8]
      }

      ionViewDidEnter(){
        this._id =localStorage.getItem('_id');
        this.requestslist = [];
        this.response_came=false;            
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
    this.apiservice.post('getAllInvitations',{_id : this._id },'').subscribe((result) => {
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

   actionOnFieldReq(rId,a,i,p_id,player_id,date,etime,stime,fullday){

       if(a==0){
           this.apiservice.post('actionOnFieldReq',{rId:rId, status:a,payment_id:p_id, owner_id:this._id,player_id:player_id,fullday:fullday},'').subscribe((result) => {  
      this.notifi.stopLoading();   
      
      console.log(result);
      this.actionres=result;
  if(this.actionres.status == 1){ 

    this.requestslist.splice(i, 1); 
    if(this.requestslist.length==0){
      this.norequest=true;

    }
    if(a==1){
      this.notifi.presentToast('Request is accepted','success');  
    }else{
      this.notifi.presentToast('Request is rejected','success');  
    } 
         
  }
},
err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error. Try again','danger');
});

       }else if(a==1){

        this.router.navigate(['request-match',{date:date,stime:stime,etime:etime,fullday:fullday,r_id:rId, player_id:player_id}]);


       }
   

    
      

   }

   action(i_id, t_id, i, status){


    this.apiservice.post('actionOnTeaminvitation',{i_id:i_id, t_id:t_id, status:status, _id: this._id},'').subscribe((result) => {  
      this.notifi.stopLoading();   
      var res;
      res= result;

     

  if(res.status == 1){ 
    this.requestslist.splice(i, 1); 

    if(this.requestslist.length==0){
      this.norequest=true;

    }
    if(status==1){
      this.notifi.presentToast('Invitation is accepted','success');  
    }else{
      this.notifi.presentToast('Invitation is rejected','success');  
    } 
         
  }
},
err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal server error. Try again','danger');
});


  }

}
