import { ModalController } from '@ionic/angular';
import { FeespayComponent  } from "../feespay/feespay.component";
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {NotiService } from '../services/noti/noti.service';
import {config} from '../config'
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { JoinWithTeamComponent } from '../join-with-team/join-with-team.component';
declare var window: any; 
import { Calendar } from '@ionic-native/calendar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.page.html',
  styleUrls: ['./match-details.page.scss'],
})
export class MatchDetailsPage implements OnInit {
          title:any;
          public win: any = window; 
          response:any;
          errors:any=['',null,undefined,'null','undefined'];
          slideOpts:any;
          fileUrl: any = null;
          respData: any; 
          userId:any; 
          username:any;
          imagedata:any; 
          url:any=config.API_URL+'server/data/pic/';  
          purl:any=config.API_URL+'server/data/p_pics/';  
          _id:any=localStorage.getItem('_id');
          matches:any;
          imgpath:any;
          matchlist:any;
          upcominglist:any;
          upcomingres:any;
          searchlist:any;
          searchres:any;
          searching:any=false;
          keyword:any;
          noresults:any=false;
          favres:any;
          favlist:any=[];
          match_id:any;
          getjoinres:any;
          getjoinresult:any=[];
          noOfPlayers:any=0;
          indexArray:any=[];
          alldata:any;
          onlyplayers:any=[];
          owner_id:any;
          response1_came:any=false;
          response2_came:any=false;
          skeleton:any=[];
          team_1:any;
          team_2:any;
          team_1_players:any;
          team_2_players:any;
          team_3_players:any;
          myname : any;
          mypic:any;
          has_team:any;
          player_ids:any=[];
          space :any;
          is_calendar:any;


          titlee:any;
          notes:any;
          location:any;
          startDate:any;
          startTime:any;
          endDate:any;
          endTime:any;
          team_id:any;

          joinedWithTeam:any;

          constructor(
          public modalController: ModalController,
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
          public ActivatedRoute:ActivatedRoute,
          public alertController: AlertController,
          private socket: Socket,
          private calendar: Calendar,
          private localNotifications: LocalNotifications
    ){
      this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
       this.match_id= this.ActivatedRoute.snapshot.paramMap.get('id');

        this.calendar.createCalendar('MyCalendar').then(
        (msg) => { console.log(msg); },
        (err) => { console.log(err); }
        );
 

      }

       ionViewDidEnter(){
         this.player_ids =[];
        this.alldata = JSON.parse(localStorage.getItem('user'));
        this.myname = this.alldata.fname[0].toUpperCase()+this.alldata.fname.slice(1) +' '+ this.alldata.lname[0].toUpperCase()+this.alldata.lname.slice(1);
        this.mypic = this.alldata.pic;
        this._id = localStorage.getItem('_id');
        this.team_1_players =[]
        this.team_2_players =[]
        this.team_3_players =[]
        this.response2_came=false; 
        this.response1_came=false; 
        this.getjoinresult=[];
        this.matchdetail();
        this.getJoinMatch();
        this.getPlayerInfo();
       }
  ngOnInit() {
  }

  
  async presentModal() {   
          const modal = await this.modalController.create({
          component: JoinWithTeamComponent,
          componentProps: {
          'player_ids': this.player_ids,
          'limit' : this.space
            }
    });

    modal.onDidDismiss().then((detail) => {
     console.log(detail)
      if(detail.data.status==1){
           this.player_ids  = detail.data.ids;
           this.joinWithTeam();
         
      }

    });

    
    return await modal.present();  
  }

  joinIndividually(){

    this.notifi.presentLoading();  
    this.apiservice.post('Joinmatch',{_id:this._id,match_id:this.match_id,status:1},'').subscribe((result) => {  
      this.notifi.stopLoading();  
      this.respData= result;
     if(this.respData.status == 1){

      // this.noOfPlayers++;  
      // this.getjoinresult.push(this._id);
      // this.team_3_players.push({
      //   pic:this.alldata.pic,
      //   fname:this.alldata.fname,
      //   lname:this.alldata.lname,
      //   position:this.alldata.position,
      //   goals:this.alldata.goals,

      // });

      this.ionViewDidEnter();
      this.notifi.presentToast(this.respData.msg,'success');

      }else if(this.respData.status == 3){

          this.notifi.presentToast(this.respData.msg,'danger');
      }else{
       this.notifi.presentToast(this.respData.msg,'danger');;
      }  

      },
      err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal error occured','danger');
      });
  }


 joinWithTeam() {
    var get_team = localStorage.getItem('team');

    var team_details = JSON.parse(get_team);

    this.player_ids.push(this._id);
    this.notifi.presentLoading();  
    this.apiservice.post('JoinWithTeam', {ids: JSON.stringify(this.player_ids), match_id : this.match_id, status:1, team_id : team_details._id, team_name: team_details.name},'').subscribe((result) => {  
      this.notifi.stopLoading();  
      this.respData= result;
     if(this.respData.status == 1){

        this.ionViewDidEnter();

      } else if(this.respData.status == 3){

          this.notifi.presentToast(this.respData.msg,'danger');
      } else{
         this.notifi.presentToast(this.respData.msg,'danger');
      }

      },
      err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal error occured','danger');
      });


  }

  leaveMatch(){

      this.notifi.presentLoading();  
      this.apiservice.post('Joinmatch',{_id:this._id,match_id:this.match_id,status:0},'').subscribe((result) => {  
      this.notifi.stopLoading();  
      this.respData= result;
     if(this.respData.status == 1){
      this.noOfPlayers--;       
      var index = this.getjoinresult.indexOf(this._id); 
      this.getjoinresult.splice(index, 1);
      this.team_3_players.splice(index, 1);    

      }else{

        this.notifi.presentToast(this.respData.msg,'danger');
      }  

      },
      err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal error occured','danger');
      });



  }

   leaveMatchWithTeam(){
      var team = localStorage.getItem('team')
      var team_id = JSON.parse(team);
      this.notifi.presentLoading();  
      this.apiservice.post('LeaveMatchWithTeam',{_id:this._id, match_id:this.match_id, status:0, team_id:team_id._id },'').subscribe((result) => {  
      this.notifi.stopLoading();  
      this.respData= result;
     if(this.respData.status == 1){
       this.ionViewDidEnter();   
      
      }else{

        this.notifi.presentToast(this.respData.msg,'danger');
      }  

      },
      err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Internal error occured','danger');
      });



  }

  
  dismiss() {
      this.modalController.dismiss({
      'dismissed': true
      });

      }


  matchdetail(){
    var team = localStorage.getItem('team')
    var team_id = JSON.parse(team);

          this.apiservice.post('p_matchdetails',{match_id:this.match_id, _id: this._id, team_id:team_id._id },'').subscribe((result) => {  
          this.response1_came=true; 
          this.notifi.stopLoading();
          this.response=result;
          if(this.response.status == 1){     
          this.is_calendar = this.response.is_calendar==1 ? true : false;
          this.matchlist=this.response;
          this.owner_id= this.response.owner._id; 
          this.team_1 = this.matchlist.match.team1
          this.team_2 = this.matchlist.match.team2
          this.title= this.matchlist.match.team1+' VS '+this.matchlist.match.team2
          this.joinedWithTeam = this.matchlist.joinedWithTeam 
          }
   
          },
          err => {
          this.response1_came=true; 
          this.notifi.stopLoading();
          this.notifi.presentToast('Internal error occured','danger');
          });

        }

  getJoinMatch(){ 
   
        this.apiservice.post('newGetJoinmatch',{match_id:this.match_id, _id:this._id},'').subscribe((result) => { 
          this.response2_came=true; 
        this.notifi.stopLoading();  
        this.getjoinres=result;
        console.log(this.getjoinres);
      
        if(this.getjoinres.status == 1){   

          this.team_1_players = this.getjoinres.players1
          this.team_2_players = this.getjoinres.players2
          this.team_3_players = this.getjoinres.players3
          this.getjoinresult = this.getjoinres.players
          this.noOfPlayers= this.getjoinresult.length;
          this.space = this.getjoinres.limit -this.noOfPlayers ;

       
         
        }else{
          this.getjoinresult=[];
          this.noOfPlayers= 0;
        }

        },
        err => {
           this.response2_came=true; 
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured','danger');
        });

            }

            count(p){
             console.log(p)
              return p
            }


  msg_popup(name, toId, type){
      this. presentAlertPrompt(name, toId, type);
  }



  send_message(message, toId, type){
    console.log(toId)
    this.apiservice.post('add_chat', {fromId: this._id, toId: toId, message : message, fromType: 'player', toType: type},'').subscribe((res) => { 
      var result;
      result = res;
      if(result.status == 1){
           this.notifi.presentToast('Message sent','danger');
        this.socket.connect();
        this.socket.emit('send_message', {_id : result.data, fromId : this._id, message : message, toId : toId, createdAt : new Date() , user_name :  this.myname, user_image :  this.mypic});
    
      }
    },
    err => {
      console.log(err)
    });

    }

async presentAlertPrompt(name, toId, type) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Quick Message To '+name,
      mode:'ios',
      inputs: [
        {
          name: 'msg',
          type: 'text',
          placeholder: 'Type message...'
        }
      
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Send',
          handler: (value) => {
          
                if(this.errors.indexOf(value.msg)==-1){
                   this.send_message(value.msg, toId , type);
            }else{
              this.notifi.presentToast('Message was empty, not sent','danger');

            }  

          }
        }
      ]
    });

    await alert.present();
  }

  getPlayerInfo(){
  this.notifi.presentLoading();
  this.apiservice.post('getPlayerInfo',{_id: this._id},'').subscribe((result) => {  
    this.notifi.stopLoading();   
    var res;
    res= result;
    if(res.status == 1){ 
      this.has_team=true;
      this.team_id= res.team_id;
    }else{
      this.has_team=false;
    }
},
err => {
    this.notifi.stopLoading();
    this.notifi.presentToast('Internal server error. Try again','danger');
});
}; 


openOptions(){
  this.choose_option();
}


  async choose_option() {
    const alert = await this.alertController.create({
      header: 'Choose joining mode',
    
      mode:"ios",
      buttons: [{
        text: 'Join Individually',
        handler: () => {
           
           this.joinIndividually() 
        
        }
      },{
        text: 'Join With Team',
        handler: () => {

       
         if(this.has_team){
            this.presentModal() 
         }else{
           this.choose_option1();
    
         }
       

        }
      }
      ,  {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }]
    });

    await alert.present();
  }


    async choose_option1() {
    const alert = await this.alertController.create({
      header: 'Please create a team first',
    
      mode:"ios",
      buttons: [{
        
        text: 'Create Team',
        handler: () => {
        this.router.navigate(['/create-team'])
       
        }
      }
      ,  {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }]
    });

    await alert.present();
  }


saveCalendar(note){
                this.notifi.presentLoading();
                var date = this.matchlist.match.date

                var start_time =  this.matchlist.match.stime+ ':00';
                var actual_start_date = new Date(date+' '+start_time);
                var start_time_value = new Date(date+' '+start_time);
              
                start_time_value.setDate(start_time_value.getDate() - 1);

                var end_time =  this.matchlist.match.etime+ ':00';
                var end_time_value = new Date(date+' '+end_time);

                console.log('actual_start_date', actual_start_date);
                console.log('end_time_value', end_time_value);
                console.log('start_time_value', start_time_value);
             

             
this.calendar.requestWritePermission();  this.calendar.createEvent(this.title, '', note, actual_start_date, end_time_value).then(
            (msg) => {
           
           
            this.apiservice.post('saveCalendar',{_id: this._id, match_id: this.matchlist.match._id},'').subscribe((result) => {  
              this.notifi.stopLoading();   
              var res;
              res= result;
              if(res.status == 1){ 
              this.is_calendar = true;
              this.notifi.presentToast('Reminder added','success');
              }else{
                 
              }
          },
          err => {
              this.notifi.stopLoading();
              this.notifi.presentToast('Internal server error. Try again','danger');
          });


              },
            (err) => { 
              this.notifi.stopLoading();
              alert('err '+err); }
);  


this.localNotifications.schedule({
    title: this.title,
    text: note,
    trigger: {at: start_time_value},
    led: 'FF0000',
    sound: this.setSound()
  });


 
 }

  setSound() {
    return 'file://assets/sounds/breaking_bad_intro.mp3'
  }

buildISODate(date, time){
      var dateArray = date && date.split('-');
      var timeArray = time && time.split(':');
var normalDate = new Date(parseInt(dateArray[0]), parseInt(dateArray[1])-1, parseInt(dateArray[2]), parseInt(timeArray[0]), parseInt(timeArray[1]), 0, 0);
      return normalDate.toISOString();
  }

  async writeNote() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'we will remind you before 24 hrs of match start time',
      mode:'ios',
      inputs: [
        {
          name: 'msg',
          type: 'text',
          placeholder: 'Write Note For Alert...'
        }
      
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (value) => {
          
             this.saveCalendar(value.msg);

          }
        }
      ]
    });

    await alert.present();
  }

}
