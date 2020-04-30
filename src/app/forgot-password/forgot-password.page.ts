import { Component, OnInit } from '@angular/core';
import {NotiService } from '../services/noti/noti.service';
import {ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email:any;
  invalid:any=false;
  is_submit:any=false;
  response:any;
  constructor (
   public noti:NotiService,
  public api:ApiService,
  public router: Router,
) { 


}

  ngOnInit() {
  }
 //custom validation
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
 
  //custom getnew password
  getnow(){
   this.is_submit= true;
   if(this.validateEmail(this.email)){
    this.noti.presentLoading();
    this.invalid= false;
    
    //api call
    this.api.post('playerGetOtp', {email:this.email},'').subscribe(res => {
      this.noti.stopLoading();
      console.log(res);
      this.response= res;
        if(this.response.status==1){
        this.router.navigate(['/otp/'+this.email]);
        this.noti.presentToast(this.response.msg,'success');
        }else{
          this.noti.presentToast(this.response.msg,'danger');         
        }
        

     },err => {
       this.noti.stopLoading();
       this.noti.presentToast('Internal Server Error, Try again','danger');
   }
    );



   }else{
     this.invalid= true;
   }    
  }



}
