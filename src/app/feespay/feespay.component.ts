import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular'
import {NotiService } from '../services/noti/noti.service';
import {ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe/ngx';
@Component({
  selector: 'app-feespay',
  templateUrl: './feespay.component.html',
  styleUrls: ['./feespay.component.scss'],
})
export class FeespayComponent implements OnInit {
  Payment='Payment';
  email:any;
  invalid:any=false;
  is_submit:any=false;
  response:any;
  match_id:any;
  player_id:any;
  owner_id:any;
  public resetform: FormGroup;

  constructor(
    
    private modalController: ModalController,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    public noti:NotiService,
    public api:ApiService,
    public router: Router,
    public activated:ActivatedRoute,
    private stripe: Stripe
    ) {
      this.makeform();
      this.match_id= this.navParams.get('match_id');
      this.player_id= this.navParams.get('player_id');
      this.owner_id= this.navParams.get('owner_id');
 
}

  ngOnInit() {}
  async myDismiss(data=0) {   
    await this.modalController.dismiss(data);
  }

  makeform(){
    this.resetform = this.formBuilder.group({
      cardno: ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(16)])],      
      expdate: ['', Validators.compose([Validators.required])],
      cvv: [null, Validators.compose([Validators.required,Validators.maxLength(3),Validators.minLength(3)])]  
  });
  }
  
    //custom getnew password
    payment(){
        
      this.is_submit=true;
      var edate = new Date(this.resetform.value.expdate);
      let year:any = edate.getFullYear();
      let month:any = edate.getMonth();    

     if(this.resetform.valid){

      this.noti.presentLoading(); 
        this.stripe.setPublishableKey('pk_test_oTy9ErDhbXxKMJ0rm265oU3N');
  
        var card = {
          number:String(this.resetform.value.cardno) ,
          expMonth:month+1,
          expYear: year,
          cvc:String(this.resetform.value.cvv),     
        };
        
        this.stripe.createCardToken(card)
           .then(token => {
             console.log(token);

            this.invalid= false;
              
            //api call
            this.api.post('bookMatchPayment',{

              token:token.id,
              match_id:this.match_id,
              player_id:this.player_id,
              owner_id:this.owner_id

            },'').subscribe(res => {
              this.noti.stopLoading();
              console.log(res);
              this.response= res;
                if(this.response.status==1){
              this.myDismiss(1);
                }else{
                  this.noti.presentToast(this.response.msg,'danger');         
                }          
        
             },err => {
               this.noti.stopLoading();
               this.noti.presentToast('Apii error, Try again','danger');
           }
            ); 
           })
           .catch(error =>{
            this.noti.stopLoading(); 
             console.log(error);
            this.noti.presentToast(error,'danger');
           });       
  
     }
  
    }

    cancel(){

      this.myDismiss(0);
    }
}