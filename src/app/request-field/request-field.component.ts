import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NotiService } from '../services/noti/noti.service';

declare var window: any; 
import {ModalController, NavParams} from '@ionic/angular'
@Component({
  selector: 'app-request-field',
  templateUrl: './request-field.component.html',
  styleUrls: ['./request-field.component.scss'],
})
export class RequestFieldComponent implements OnInit {
  @Input() firstName: string;
  updatedata:FormGroup;
  errors:any=['',' ',null,undefined,'null','undefined'];
  timerequired:any=false;
  is_submit:any=false;
  response:any;
  owner_id:any;
  _id:any;
  isActive:any;
  date:any;
  constructor(private modalController: ModalController,
    public formBuilder: FormBuilder,	
    public apiservice:ApiService,
    public notifi:NotiService,
    public navParams: NavParams
     ) {
      this.date= new Date().toISOString();
      this.makeform();
      this.owner_id= navParams.get('owner_id');
      this._id= localStorage.getItem('_id');
     
}

makeform(){
  this.updatedata= this.formBuilder.group({
       fullday:[false],
       date:['',Validators.compose([Validators.required])],
       time:[null],
       comment:['',Validators.compose([Validators.required])],

  });
}

  ngOnInit() {}
  async myDismiss() {
    const result: Date = new Date();
    
    await this.modalController.dismiss(result);
  }

  sendrequest(){
    console.log(this.updatedata.value.time);
    console.log(this.updatedata.value.fullday);
    
    this.is_submit=true;
    if(this.updatedata.valid){
   
      if(this.updatedata.value.fullday==false && this.errors.indexOf(this.updatedata.value.time)>=0){
        this.timerequired=true;  
        
        


       }else{
        this.notifi.presentLoading();
        
         var data={
                    owner_id:this.owner_id,
                    _id:this._id,
                    fullday:this.updatedata.value.fullday,
                    date:this.updatedata.value.date,
                    time:this.updatedata.value.time,
                    comment:this.updatedata.value.comment          
                   }

        this.apiservice.post('fieldRequest',data,'').subscribe((result) => {  
          this.notifi.stopLoading();              
          this.response=result;
          console.log(this.response)
          if(this.response.status==1){
            this.is_submit=false;
            this.updatedata.reset();
            this.notifi.presentToast('Request sent','success');
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
  }

}
