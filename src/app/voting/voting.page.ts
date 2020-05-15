import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config'
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { VotingPlayersPage } from '../voting-players/voting-players.page';
@Component({
  selector: 'app-voting',
  templateUrl: './voting.page.html',
  styleUrls: ['./voting.page.scss'],
})
export class VotingPage implements OnInit {
  title="Vote";
  addmatch:FormGroup;
  is_submit:boolean=false;
  response:any;
  _id:any=localStorage.getItem('_id');
  imgpath:any;
  comment:any;
  errors:any=['',null,undefined,'null','undefined',0];
  player_name:any;
  selected_player_id:any;
  match_id:any;
  constructor(public modalController: ModalController,
    public formBuilder: FormBuilder,
    public router: Router,
    public apiservice:ApiService,
    public notifi:NotiService,
    public alertController: AlertController,
    public ActivatedRoute:ActivatedRoute 
    ) {
      this.match_id= this.ActivatedRoute.snapshot.paramMap.get('_id');
       this.makeform();

  }

  ngOnInit() {
  }
  ionViewDidEnter(){

      
  }

  async openModal(){

    const modal = await this.modalController.create({
      component: VotingPlayersPage,
      componentProps: {
        selected_player_id: this.selected_player_id,
        player_name: this.player_name,
        match_id: this.match_id
      }

    });

    modal.onDidDismiss().then((detail) => {
      console.log(detail);
      if(this.errors.indexOf(detail.data.player_name)==-1){
        this.player_name = detail.data.player_name;

      }
      if(this.errors.indexOf(detail.data.selected_player_id)==-1){
        this.selected_player_id = detail.data.selected_player_id

      }
    

    }
    );

     return await modal.present();


  }

  makeform(){
    this.addmatch= this.formBuilder.group({
         type:['',Validators.compose([Validators.required])],
       
    });
  }


  vote(){
    this.is_submit=true;
 
     if(this.errors.indexOf(this.comment)==-1 && this.errors.indexOf(this.selected_player_id)==-1){
    

              var reqdata = {

                match_id : this.match_id,	
                toId : this.selected_player_id,
                fromId : this._id,
                comment : this.comment,
              }

              this.apiservice.post('voteForMOTM',reqdata,'').subscribe((result) => {  
                this.notifi.stopLoading();   
                var res;
                res= result;
                if(res.status==1){
                  this.presentAlert('Success', 'You have voted the player successfully');
                  this.router.navigate(['/notifications'])
                 }else if(res.status==2){

                  this.presentAlert('Voted already', 'You have already voted for this match');
                  this.router.navigate(['/notifications'])

                }else{

                  this.presentAlert('Error', 'Internal server error');

                }
             
             
          },
          err => {
                this.notifi.stopLoading();
                this.notifi.presentToast('Internal server error. Try again','danger');
          });
              
    
    
      }

  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


}

