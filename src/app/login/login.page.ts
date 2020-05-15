import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NotiService } from '../services/noti/noti.service';
import {ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {Events } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public login: FormGroup;
  public is_submit:any=false;
  errors:any=['',null,undefined,0,'null','undefined'];
  response:any;
    token:any;

  constructor(
    public formBuilder: FormBuilder,
    public noti:NotiService,
    public api:ApiService,
    public router: Router,
    private events:Events,
       private fcm: FCM
  ) {
     
    this.makeform();
 

   }

   ionViewDidEnter(){

      this.fcm.getToken().then(token => {
      this.token= token;
      });

    let thiss= this
    setTimeout(function(){
      if(thiss.errors.indexOf(JSON.parse(localStorage.getItem('remember')))==-1){
        console.log('true');
        var values= JSON.parse(localStorage.getItem('remember'));
        thiss.login.patchValue({
         email:values.email,
         password:values.password   
       });  
     
      }
    },1000); 

   }

  makeform(){
    this.login = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required,Validators.email])],      
      password: ['', Validators.compose([Validators.required])],
      remember: [null]               
  });
  }

  ngOnInit() {
  }

  justlogin(){
    this.is_submit=true;
    if(this.login.valid){
      this.noti.presentLoading();

      var data= {
         email:this.login.value.email,
         password:this.login.value.password,
         uid: this.token
      }

      this.api.post('p_login', data,'').subscribe(res => {
        this.noti.stopLoading();
        this.response= res;
          if(this.response.status==1){  

           
            if(this.login.value.remember){
              localStorage.setItem('remember',JSON.stringify({email:this.login.value.email,password:this.login.value.password}));
            }else{
              localStorage.removeItem('remember');
            }  

            localStorage.setItem('_id',this.response.data._id);
            localStorage.setItem('logged_in',this.response.data._id);
            localStorage.setItem('user',JSON.stringify(this.response.data));
            this.events.publish('logged',this.response.data.pic);
            this.login.reset();
            this.is_submit=false;
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
