import { Component, OnInit } from '@angular/core';
import {NotiService } from '../services/noti/noti.service';
import {ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe/ngx';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  email:any;
  invalid:any=false;
  is_submit:any=false;
  response:any;
  public resetform: FormGroup;
  constructor (
    public formBuilder: FormBuilder,
    public noti:NotiService,
    public api:ApiService,
    public router: Router,
    public activated:ActivatedRoute,
    private stripe: Stripe
) { 
     this.email= this.activated.snapshot.paramMap.get('email');
     this.makeform();
}

makeform(){
  this.resetform = this.formBuilder.group({
    npassword: ['', Validators.compose([Validators.required])],      
    cpassword: ['', Validators.compose([Validators.required])],
    otp: [null, Validators.compose([Validators.required])]

});
}

  ngOnInit() {
  }
 
  //custom getnew password
  payment(){


    this.stripe.setPublishableKey('pk_test_griqNxpczBmOlFEBJPebuM1i00IuKtPDQ5');

    let card = {
     number: '4242424242424242',
     expMonth: 12,
     expYear: 2020,
     cvc: '220'
    }
    
    this.stripe.createCardToken(card)
       .then(token => console.log(token.id))
       .catch(error => console.error(error));


    return;
   this.is_submit= true;
   if(this.resetform.valid){
      
      this.invalid= false;
      this.noti.presentLoading();      
      //api call
      this.api.post('playerResetPassword',{
        otp:this.resetform.value.otp,
        email: this.email,
        npassword:this.resetform.value.npassword        
      },'').subscribe(res => {
        this.noti.stopLoading();
        console.log(res);
        this.response= res;
          if(this.response.status==1){
          this.router.navigate(['/tabs/tabs/home']);
          this.noti.presentToast(this.response.msg,'success');
          }else{
            this.noti.presentToast(this.response.msg,'danger');         
          }          
  
       },err => {
         this.noti.stopLoading();
         this.noti.presentToast('Internal Server Error, Try again','danger');
     }
      );      

   }

  }

}
