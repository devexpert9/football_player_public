import { Component, OnInit } from '@angular/core';
import {NotiService } from '../services/noti/noti.service';
import {ApiService } from '../services/api/api.service';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe/ngx';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  Payment='Payment';
  email:any;
  invalid:any=false;
  is_submit:any=false;
  response:any;
  match_id:any;
  player_id:any;
  owner_id:any;
  c_id:any;
  type:any;
  amnt:any;
  respData:any
  amount_to_pay:any;
  o_id:any;
  _id:any=localStorage.getItem('_id');
  static_amount: any;
  pay_type:any;
  coming_status:any
  public resetform: FormGroup;

  constructor(

    public formBuilder: FormBuilder,
    public noti:NotiService,
    public api:ApiService,
    public router: Router,
    public activated:ActivatedRoute,
    private stripe: Stripe,
    public ActivatedRoute:ActivatedRoute,
    public apiservice:ApiService,
    public alertController: AlertController 
    ) {

      this.coming_status = this.ActivatedRoute.snapshot.paramMap.get('coming_status');
console.log(this.coming_status)
      this.match_id = this.ActivatedRoute.snapshot.paramMap.get('m_id');
      this.c_id = this.ActivatedRoute.snapshot.paramMap.get('c_id');
      this.type = Number(this.ActivatedRoute.snapshot.paramMap.get('type'));
      this.o_id = this.ActivatedRoute.snapshot.paramMap.get('o_id');
     if(this.type=='0'  || this.type==0){

       this.amnt = 10
       this.amount_to_pay = 9;
       this.static_amount = 10
       this.pay_type = 1

     }else if(this.type==1 || this.type=='1'){

      this.amnt = 120
      this.amount_to_pay = 108;
      this.static_amount = 120
      this.pay_type = 1

     }
     else if(this.type==3 || this.type=='3'){
     
      this.amnt = 10
      this.amount_to_pay = 9;
      this.static_amount = 10
      this.pay_type = 2
      
     }

      this.makeform();
      
 
}

 

  ngOnInit() {}
 

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
        this.stripe.setPublishableKey('pk_test_griqNxpczBmOlFEBJPebuM1i00IuKtPDQ5');
  
        var card = {
          number:String(this.resetform.value.cardno) ,
          expMonth:month+1,
          expYear: year,
          cvc:String(this.resetform.value.cvv),     
        };
        
        this.stripe.createCardToken(card)
           .then(token => {

            var reqData={
              owner_id : this.o_id,
              match_id : this.match_id,
              confirmation_id : this.c_id,
              amount : this.amnt,
              token: token.id,
              commission: this.amount_to_pay,
              _id: this._id,
              type : this.pay_type,
              coming_status : this.coming_status
             }
             
               this.apiservice.post('confirmPayment',reqData,'').subscribe((result) => {  
                 this.noti.stopLoading();  
                 this.respData= result;
                if(this.respData.status == 1){
                    
                 if(this.type==1){
                   this.router.navigate(['/notifications']);
                 }else{
                   this.router.navigate(['/confirmations']);
                 }
                
                
                 this.presentAlert('Payment successfull', 'Your availability has been confirmed ')

                 
           
                 } else{
                   this.noti.presentToast(this.respData.msg,'danger');

                 }
           
                 },
                 err => {
                 this.noti.stopLoading();
                 this.noti.presentToast('Internal error occured','danger');
                 });
              
           })
           .catch(error =>{
            this.noti.stopLoading(); 
             console.log(error);
            this.noti.presentToast(error,'danger');
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