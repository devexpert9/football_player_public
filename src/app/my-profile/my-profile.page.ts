import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config'
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any; 
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  public win: any = window; 
  response:any;
  profileData: any;
  IsLoggedIn: any = localStorage.getItem('isLoggedIn');
  IsPasswordUpadte: any = false;
  profileImage: any = null;
  imageURI: any;
  errors:any=['', null, undefined, 'null', 'undefined'];
  slideOpts:any;
  fileUrl: any = null;
  respData: any; 
  userId:any; 
  username:any;
  imagedata:any;
  allpics:boolean=false;
  lastpic:any;
  camerapic:boolean=false;
  totalimages:any;
  morethan9:boolean=false;
  yes:boolean=false;
  realemail='asdc';
  authForm: FormGroup; 
  passwordfrom: FormGroup; 
  firstname:any;
  lastname:any;
  email:any;
  contact:any;
  image:any;
  propic:any;
  profile:any;
  url:any= config.API_URL+'server/data/p_pics/';
  updatedata:FormGroup;
  is_submit:any=false;
  filevar:any;
  _id:any;
  title:any;
  matches:any;
  rate:any;
  onRateChange:any;
  presentModal:any;
  imgpath:any;
  imgblob:any;
  alldata:any;
  second_form:any=false;  
  img_selected:any=false; 
  lat:any;
  lng:any;
  userSettings = {};
  address:any;
  myOptions:any;
  has_team:any;
  points:any;
  constructor(	   
    public formBuilder: FormBuilder,	
    private filePath: FilePath,
    private transfer: FileTransfer,
    private file: File,
    private camera: Camera,
    private ref: ChangeDetectorRef,    
    public TransferObject:FileTransferObject,
    public router: Router,
    public actionSheetController: ActionSheetController, 
    public events: Events, 	
    private platform: Platform,
    public apiservice:ApiService,
    public notifi:NotiService,
    public sanitizer:DomSanitizer  
       )  { 

        this.alldata =JSON.parse(localStorage.getItem('user')); 
         this.address='';
         this.lat='';
         this.lng='';
           this.makepasswordform();    
              this.makeform();
           this._id= localStorage.getItem('_id');
           if(this.errors.indexOf(this.alldata.pic)){
            this.propic=this.alldata.pic;   
           }
             
           this.profile = "personal";
          
           this.userSettings['inputString'] = this.alldata.address ;
           this.address= this.alldata.address ;
           this.userSettings = Object.assign({},this.userSettings);  
           
           this.myOptions = {
            'placement': 'left',
            'show-delay': 500
        }
          
          }

  ngOnInit() {
  }
   ionViewDidEnter(){
    
    this.alldata =''
    this.alldata= JSON.parse(localStorage.getItem('user')); 
    this.propic=this.alldata.pic;    

       this.updatedata.patchValue({
            fname:this.alldata.fname,
            lname:this.alldata.lname,
            email:this.alldata.email,
            phone:this.alldata.phone,
            city:this.alldata.city,
            state:this.alldata.state,
            country:this.alldata.country,
            zip:this.alldata.zip,     
            weight:this.alldata.weight,
            height:this.alldata.height,
            dob:this.alldata.dob,
            position:this.alldata.position
           });

     this.getPlayerInfo();      
   }
  makeform(){
    this.updatedata= this.formBuilder.group({
         fname:['',Validators.compose([Validators.required])],
         lname:['',Validators.compose([Validators.required])],
         email:['',Validators.compose([Validators.required])],
         phone:['',Validators.compose([Validators.required])],
         city:['',Validators.compose([Validators.required])],
         state:['',Validators.compose([Validators.required])],
         country:['',Validators.compose([Validators.required])],
         zip:['',Validators.compose([Validators.required])],      
         weight:['',Validators.compose([Validators.required])],
         height:['',Validators.compose([Validators.required])],
         dob:['',Validators.compose([Validators.required])],
         position:['',Validators.compose([Validators.required])]
    });
  }

  makepasswordform(){
    this.passwordfrom= this.formBuilder.group({
         opassword:['',Validators.compose([Validators.required])],
         cpassword:['',Validators.compose([Validators.required])], 
         npassword:['',Validators.compose([Validators.required,Validators.minLength(6)])], 
    });
  }

   //picture update
   async selectImage() {
    const actionSheet = await this.actionSheetController.create({
    header: "Select Image source",
    mode:"ios",
    buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.camerapic=false;
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
      },
      {
          text: 'Use Camera',
          handler: () => {
              this.camerapic=true;
              this.takePicture(this.camera.PictureSourceType.CAMERA);
             
          }
      },
      {
          text: 'Cancel',
          role: 'cancel'
      }
    ]
  });
  await actionSheet.present();
}

takePicture(sourceType: PictureSourceType) {
  var options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
  };
  this.camera.getPicture(options).then(imagePath => {
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
            .then(filePath => {  
              this.img_selected=true;    
              this.imgpath=imagePath;
            });
    }

    this.img_selected=true;    
    this.imgpath=imagePath;
  });
} 

updatepersnl() {
  
    this.is_submit=true;
    if(this.updatedata.valid){
      
    if(this.errors.indexOf(this.imgpath)==-1){
      this.file.resolveLocalFilesystemUrl(this.imgpath)
      .then(entry => {
          ( < FileEntry > entry).file(file => {
            console.log('read file');
            this.notifi.presentLoading();
            const reader = new FileReader();
            reader.onloadend = () => {
              console.log('onloadend');
              const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            this.finalfun(imgBlob,file.name);           
          }
          reader.readAsArrayBuffer(file);

          })
      })
      .catch(err => {
          this.notifi.presentToast('Error while reading file.','danger');
      });     
    }else{

      this.finalfun(2,''); 

    }       
  
  }
}


finalfun(img,file){
  const formData = new FormData();
  if(img!=2){
    formData.append('file', img, file); 
  }

    var date = new Date(this.updatedata.value.dob);

    let year:any = date.getFullYear();
    let month:any = date.getMonth()+1;
    let day:any = date.getDate();

   console.log(month);

    if(day.toString().length<2){
       day= '0'+day;
    }

  
      var dateofb = year+'-'+ month+'-' + day;
   

  formData.append('_id', this._id);
  formData.append('fname', this.updatedata.value.fname);
  formData.append('lname', this.updatedata.value.lname);
  formData.append('email', this.updatedata.value.email);
  formData.append('city', this.updatedata.value.city);
  formData.append('country', this.updatedata.value.country);
  formData.append('zip', this.updatedata.value.zip);
  formData.append('phone', this.updatedata.value.phone);
  formData.append('state', this.updatedata.value.state);
  formData.append('address', this.address);
  formData.append('weight', this.updatedata.value.weight);
  formData.append('height', this.updatedata.value.height);
  formData.append('position', this.updatedata.value.position);
  formData.append('dob', dateofb);
   formData.append('lat', this.lat);
  formData.append('lng', this.lng);

  this.apiservice.post('p_updateinfo/'+this._id+'/'+this.updatedata.value.email, formData,'').subscribe((result) => {                
        this.response=result;
    if( this.response.status == 1){
        localStorage.setItem('user', JSON.stringify(this.response.data)); 
        var publishdata={
          fname:this.updatedata.value.fname,
          lname:this.updatedata.value.lname,
          pic:this.response.data.pic
        }

        this.events.publish('newdata',JSON.stringify(publishdata));
        this.propic=this.response.data.pic
          
        this.alldata= JSON.parse(localStorage.getItem('user'));                
        this.ref.detectChanges();
        this.notifi.stopLoading();
        this.notifi.presentToast('Profile has been updated','success');
    }
    else{
        this.notifi.stopLoading();
        this.notifi.presentToast('Error while updating profile,Please try later','danger');
    }
  },
  err => {
        this.notifi.stopLoading();
        this.notifi.presentToast('Error while updating profile  ,Please try later','danger');
  });
}

updatepassword(){ 
  this.second_form=true;
 if(this.passwordfrom.valid){
 
   if(this.passwordfrom.value.npassword==this.passwordfrom.value.cpassword){
    this.notifi.presentLoading();
     var passdata={
       _id:this._id,
       opassword:this.passwordfrom.value.opassword,
       npassword:this.passwordfrom.value.npassword
     }
    this.apiservice.post('p_updatepassword',passdata,'').subscribe((result) => {  
      this.notifi.stopLoading();              
      this.response=result;
  if(this.response.status == 1){
     
      this.notifi.presentToast(this.response.msg,'success');
      this.passwordfrom.reset();
      this.second_form=false;
  }
  else{
     
      this.notifi.presentToast(this.response.msg,'danger');
  }
},
err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Error while updating profile  ,Please try later','danger');
});
   }else{
    this.notifi.presentToast('Passwords do not match','danger');
   }
 }
}

autoCompleteCallback1(selectedData:any) {

 this.lat= selectedData.data.geometry.location.lat;
 this.lng= selectedData.data.geometry.location.lng;
 this.address=selectedData.data.description;

  this.updatedata.patchValue({
    address: selectedData.data.description
    }); 
}


getPlayerInfo(){

  this.notifi.presentLoading();
  this.apiservice.post('getPlayerInfo',{_id: this._id},'').subscribe((result) => {  
    this.notifi.stopLoading();   
    var res;
    res= result;
    if(res.status == 1){ 
      this.has_team=true;
      this.points= res.points;
          
    }else{
      this.has_team=false;

    }
},
err => {
    this.notifi.stopLoading();
    this.notifi.presentToast('Internal server error. Try again','danger');
});





}; 



}
