import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {NotiService } from '../services/noti/noti.service';
import {ActivatedRoute} from '@angular/router';
import { RequestfieldmodalComponent } from "../requestfieldmodal/requestfieldmodal.component";
declare var window: any; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalController} from '@ionic/angular'
import { AlertController } from '@ionic/angular';
import { SelectPlayersFromTeamPage } from '../select-players-from-team/select-players-from-team.page';
@Component({
  selector: 'app-requestformatch',
  templateUrl: './requestformatch.page.html',
  styleUrls: ['./requestformatch.page.scss'],
})
export class RequestformatchPage implements OnInit {
  title='Request field';
  updatedata:FormGroup;
  errors:any=['',' ',null,undefined,'null','undefined'];
  timerequired:any=false;
  is_submit:any=false;
  response:any;
  owner_id:any;
  _id:any;
  isActive:any;
  date:any;
  amount:any;
  payment_id:any;
  stime:any;
  etime:any;
  selected_player_id:any=[];
  selected:boolean=false;
  team_id: any;
  is_today:any=true;
  total_hours:any;
  end_hours:any;
  constructor(private modalController: ModalController,
    public formBuilder: FormBuilder,	
    public apiservice:ApiService,
    public notifi:NotiService,
    public ActivatedRoute:ActivatedRoute,
    public router: Router
     ) {
      this.date= new Date().toISOString();
      this.makeform();
      this.owner_id= this.ActivatedRoute.snapshot.paramMap.get('owner_id')
      this._id= localStorage.getItem('_id');
     
}


async presentModal() {

  const modal = await this.modalController.create({
    component: SelectPlayersFromTeamPage,
    componentProps: {
     
     'selected_player_id' : this.selected_player_id,
  
    }
  });


  modal.onDidDismiss().then((detail) => {
    
     console.log(detail)
     if(detail.data.status==1){
       this.selected_player_id= detail.data.selected_player_ids;
       this.selected=true;
       this.team_id =  detail.data.team_id
     }

   });
  return await modal.present();
}


makeform(){
  this.updatedata = this.formBuilder.group({
       fullday:[false],
       date:['',Validators.compose([Validators.required])],
       stime:[null],
       etime:[null],
       comment:['',Validators.compose([Validators.required])],

  });
}

  ngOnInit() {}



  sendrequest(){

    this.is_submit=true;

    if(this.updatedata.valid && this.selected_player_id.length!=0){
      this.notifi.presentLoading();
      var sdate = new Date(this.updatedata.value.stime);
      var edate = new Date(this.updatedata.value.etime);
      let shour:any = sdate.getHours();
      let smin:any = sdate.getMinutes();
      let ehour:any = edate.getHours();
      let emin:any = edate.getMinutes();

      if(shour.toString().length<2){
        shour = '0'+shour;
      }

      if(smin.toString().length<2){
         smin= '0'+smin;
      }

      if(ehour.toString().length<2){
        ehour= '0'+ehour;
      }

      if(emin.toString().length<2){
        emin= '0'+emin;
      }

      this.stime= shour+ ':'+smin;
      this.etime= ehour+':'+emin;

  
      var data ={
                  owner_id:this.owner_id,
                  _id:this._id,
                  fullday:this.updatedata.value.fullday,
                  date:this.updatedata.value.date.split('T')[0],
                  time:this.updatedata.value.time,
                  comment:this.updatedata.value.comment ,
                  // payment_id:this.payment_id,
                  stime: this.stime,
                  etime: this.etime,  
                  selected_player_id:  this.selected_player_id.length!=0 ? this.selected_player_id : [],
                  team_id: this.team_id
                         
                }

                
     this.apiservice.post('fieldRequest',data,'').subscribe((result) => {  
       this.notifi.stopLoading();              
       this.response=result;
       console.log(this.response)
       if(this.response.status==1){
         this.is_submit=false;
         this.updatedata.reset();
         this.notifi.presentToast('Request sent','success');
         this.router.navigate(['/home'])
       }else if(this.response.status==2){
         this.notifi.presentToast('This time slot is already taken','danger');
       }else{
        this.notifi.presentToast('Internal server error','danger');
      }
  
  },
  err => {
       this.notifi.stopLoading();
       this.notifi.presentToast('Error while updating profile  ,Please try later','danger');
  });
     console.log(this.updatedata.value);
     this.timerequired=false;


    }
  

  }



  checkForm(){
    console.log(this.updatedata.value.date.split('T')[0]);
    this.is_submit=true;
    if(this.updatedata.valid){

     var sdate = new Date(this.updatedata.value.stime);
        var edate = new Date(this.updatedata.value.etime);
        let shour:any = sdate.getHours();
        let smin:any = sdate.getMinutes();
        let ehour:any = edate.getHours();
        let emin:any = edate.getMinutes();

        if(shour.toString().length<2){
          shour = '0'+shour;
        }

        if(smin.toString().length<2){
           smin= '0'+smin;
        }

        if(ehour.toString().length<2){
          ehour= '0'+ehour;
        }

        if(emin.toString().length<2){
          emin= '0'+emin;
        }

        this.stime= shour+ ':'+smin;
        this.etime= ehour+':'+emin;

    
      //
    if(this.updatedata.value.fullday==true){
      this.timerequired=false;
      this.presentModal();  


    }else{

       if(this.updatedata.value.stime==null || this.updatedata.value.etime==null){
        this.timerequired=true; 
       }else{
          this.timerequired=false;
        this.presentModal();    
        } 

    }
      
    }
  }

  presentModal2(){


  }

  checkdate(){
 
  this.updatedata.controls['stime'].setValue(null)
  this.updatedata.controls['etime'].setValue(null)
   var d = new Date();
   var date:any = d.getDate();
   var month:any = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
   var year = d.getFullYear();
   if (date < 10) {
     date = '0' + date;
   }
   if (month < 10) {
     month = '0' + month;
   }
  
   var hours:any = d.getHours();
   var mins:any = d.getMinutes();
  
   if (hours < 10) {
     hours = '0' + hours;
   }
   if (mins < 10) {
     mins = '0' + mins;
   }
  
   var stime = hours + ':' + mins;
   var dateStr = year + "-" + month + "-" + date;
  
  if(this.updatedata.value.date.split('T')[0]==dateStr){
    this.is_today=true;
    var hours_n = new Date().getHours();
    var i= hours_n;
    var cars = 24
    var hours_array =[];
    for (i = hours; i <= cars; i++) {
      console.log(i)
      hours_array.push(hours_n++)
      
    }
    this.total_hours = hours_array
  
  
  
  }else{
    this.is_today=false;
  }
     
  }


  checktime(){
    this.updatedata.controls['etime'].setValue(null)

    var hours_n =  new Date(this.updatedata.value.stime);
    let ehour:any = hours_n.getHours();
    var i= ehour;
    var cars = 24
    var hours_array =[];
   for (i = ehour; i <= cars; i++) {
     console.log(i)
     hours_array.push(ehour++)
     
   }
   this.end_hours = hours_array

 }

}
