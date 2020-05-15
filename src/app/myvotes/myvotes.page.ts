import { ModalController } from '@ionic/angular';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config'
import {ActivatedRoute} from '@angular/router';
import { SelectFavComponent } from "../select-fav/select-fav.component";
declare var window: any; 


@Component({
  selector: 'app-myvotes',
  templateUrl: './myvotes.page.html',
  styleUrls: ['./myvotes.page.scss'],
})
export class MyvotesPage implements OnInit {
  title="Votes";
  _id:any=localStorage.getItem('_id');
  notiArray:any;
  notires:any;
  purl:any=config.API_URL+'server/data/p_pics/';  
  response_came:boolean=false;
  errors:any=['',null,undefined,'null','undefined'];
  skeleton:any;
  constructor(
          public modalController: ModalController,
          public router: Router,
          public apiservice:ApiService,
          public notifi:NotiService,
          public ActivatedRoute:ActivatedRoute
              ) {
                this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
     
  }

  ngOnInit() {
  }

    ionViewDidEnter(){
      this.response_came=false;  
    this.getMyVotes();

  }


  getMyVotes(){ 
    
        this.apiservice.post('getMyVotes',{toId: this._id},'').subscribe((result) => { 
        this.notifi.stopLoading();  
        this.notires = result;
        this.response_came = true;
        console.log(this.notires);
      
        if(this.notires.status == 1){ 
          
          this.notiArray=this.notires.data;
         
        }else{
          
          this.notiArray=[];
         
        }

        },
        err => {
          this.response_came=true;  
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured','danger');
        });

            }

          //   clear(_id,i){

          //     this.apiservice.post('clear_player_notifications',{_id:_id},'').subscribe((result) => {  
          //       this.notifi.stopLoading();   
          //       this.notiArray
          //       console.log(result);
          //     var res;
          //     res=result;                
          //   if(res.status == 1){          
          //     this.notiArray.splice(i, 1);                  
          //   }
          // },
          // err => {
          //       this.notifi.stopLoading();
          //       this.notifi.presentToast('Internal server error. Try again','danger');
          // });
                
          
          //    }
}
