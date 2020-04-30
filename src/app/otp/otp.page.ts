import { Component, OnInit } from '@angular/core';
import {NotiService } from '../services/noti/noti.service';
import {ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
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
    public activated:ActivatedRoute
) { 
     this.email= this.activated.snapshot.paramMap.get('email');
     this.makeform();
}

makeform(){
  this.resetform = this.formBuilder.group({
    npassword: ['', Validators.compose([Validators.required,Validators.minLength(6)])],      
    cpassword: ['', Validators.compose([Validators.required])],
    otp: [null, Validators.compose([Validators.required])]

});
}

  ngOnInit() {
  }
 
  //custom getnew password
  getnow(){
   this.is_submit= true;
   if(this.resetform.valid){
      
    if(this.resetform.value.npassword==this.resetform.value.cpassword){
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
  
     }else{
      this.invalid=true;
     }

   }


  }

  matchpasswords(){
    if(this.is_submit && this.resetform.value.npassword==this.resetform.value.cpassword){
      this.invalid= false;
    }
  }



}
