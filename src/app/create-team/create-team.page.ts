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
import { ModalController } from '@ionic/angular';
import { PopupPlayersPage } from '../popup-players/popup-players.page';
@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.page.html',
  styleUrls: ['./create-team.page.scss'],
})
export class CreateTeamPage implements OnInit {
  public win: any = window; 
  title="Create Team";
  addmatch:FormGroup;
  is_submit:any;InAppBrowser
  response:any;
  _id:any=localStorage.getItem('_id');
  imgpath:any;
  errors:any=['',null,undefined,'null','undefined',0];
  covererr:any=false;
  date:any;
  stime:any;
  etime:any;
  stripe_id:boolean=false;
  alldata:any;
  players:any;
  url:any=config.API_URL+'server/data/p_pics/';
  ids:any=[];
  public form = [
    { val: 'Pepperoni', isChecked: true },
    { val: 'Sausage', isChecked: false },
    { val: 'Mushroom', isChecked: false }
  ];
  constructor(public modalController: ModalController,
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
    public sanitizer:DomSanitizer,
    ) {
         this.date= new Date().toISOString();
       this.makeform();


  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.ids=[];
    this.stripe_id = false;
    this.alldata= JSON.parse(localStorage.getItem('user'));    
     
      if(this.errors.indexOf(this.alldata.stripe_id)==-1){
        this.stripe_id = true;

      }

      
      
  }

  makeform(){
    this.addmatch= this.formBuilder.group({
         name:['',Validators.compose([Validators.required])],
      
    });
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: PopupPlayersPage,
      componentProps: {ids: this.ids}

    });

    modal.onDidDismiss().then((detail) => {

      this.ids = detail.data.ids


    })

    return await modal.present();
  }



  async selectImage() {
    this.imgpath='';
    const actionSheet = await this.actionSheetController.create({
    header: "Select Image source",
    mode:"ios",
    buttons: [{
          text: 'Load from Library',
          handler: () => {
         
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
      },
      {
          text: 'Use Camera',
          handler: () => {
            
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
  this.covererr=false;
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
           
              this.imgpath=imagePath;

            });
    } else {
      // this.startUpload(imagePath);
    
      this.imgpath= imagePath;
     
    }
  });
} 


  addmatchnow(){


    console.log(this.ids)
  
    var sdate = new Date(this.addmatch.value.stime);
    var edate = new Date(this.addmatch.value.etime);
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

  
   this.is_submit=true;  

   if(this.errors.indexOf(this.imgpath)==-1 && this.addmatch.valid){
    this.file.resolveLocalFilesystemUrl(this.imgpath)
    .then(entry => {
        ( < FileEntry > entry).file(file => {
          console.log('read file');
          const reader = new FileReader();
          reader.onloadend = () => {
            console.log('onloadend');
            const imgBlob = new Blob([reader.result], {
              type: file.type
          });
          this.uploadmatch(imgBlob,file.name);           
        }
        reader.readAsArrayBuffer(file);

        })
    })
    .catch(err => {
        this.notifi.presentToast('Error while reading file.','danger');
    });     
  }else{
    this.covererr=true;
  } 

  }

   uploadmatch(img,file){
    this.notifi.presentLoading(); 
    this.ids.push(this._id);
    const formData = new FormData();
    formData.append('file', img, file); 
    formData.append('_id', this._id);
    formData.append('name', this.addmatch.value.name);
    formData.append('ids', JSON.stringify(this.ids));


  
     this.apiservice.post('createTeam/',formData,'').subscribe((result) => {  
       this.notifi.stopLoading();              
       this.response=result;
            if(this.response.status == 1){
              this.notifi.presentToast('Team has been created and invitations have been sent to selected players','success');  
              this.is_submit=false;
              this.addmatch.reset();   
              this.imgpath=''; 
              this.router.navigate(['/my-profile']);
 
              }
},
 err => {
       this.notifi.stopLoading();
       this.notifi.presentToast('Internal server error. Try again','danger');
 });
   
  }

 
}

