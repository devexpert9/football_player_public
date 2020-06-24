import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import {ApiService } from '../services/api/api.service';
import { config } from '../config';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import { Events } from '@ionic/angular';
import { NotiService } from '../services/noti/noti.service';
declare var window: any;
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  public win: any = window;
@ViewChild('content',{static : true}) private content: any;
_id:any;
toId:any;
chat_message:any;
chats:any=[];
chat_name:any;
chat_image:any;
chat_is_social_image:any;
errors:any = ['', null, undefined, "null"];
mySession:any;
new_message:any;
IMAGES_URL:any=config.IMAGES_URL;
allowedMimes:any=config.IMAGE_EXTENSIONS;
person_id:any;
inboxId:any;
p_purl: any=config.API_URL+'server/data/p_pics/'; 
purl: any=config.API_URL+'server/data/pic/'; 
property: any=config.API_URL+'server/data/property/'; 
player :any;
alldata :any;
type:any
  constructor( 
              public events:Events,
              private activatedRoute: ActivatedRoute,
              private socket: Socket,
              public sanitizer:DomSanitizer,
              private platform: Platform,
              private ref: ChangeDetectorRef,
              public actionSheetController: ActionSheetController,
              public apiservice: ApiService,
              public notifi: NotiService,
) { 

             
              this.getUpdates().subscribe(new_message => {
              console.log('new_message')
              console.log(new_message)
              this.new_message = new_message;

              if(this.new_message.toId == this._id){
                console.log(this.new_message);
                this.chats.push(this.new_message);
                this.scrollToBottom();
              }
           });
              
  }

  ngOnInit() {
  }

  ionViewDidEnter(){

    this._id = '';
    this.toId ='';
    this.chat_message = '';
    this.chats =[];
    this.new_message = '';
    this.person_id = '';
    this._id = '';
    this.inboxId = '';
    this.player = '';
    this.alldata = '';
    this.toId = localStorage.getItem('_id');
    this.alldata =JSON.parse(localStorage.getItem('user')); 
    this.player = '';
    this.inboxId= this.activatedRoute.snapshot.paramMap.get('id');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');

    this._id= localStorage.getItem('_id');
    this.person_id = '12345678'
  	this.getChat();
  }

  getChat(){
  	this.notifi.presentLoading();
    this.apiservice.post('get_chat', {_id : this._id, personId : this.inboxId, type: this.type},'').subscribe((res) => {
      var result;
      result = res;
      this.socket.connect();
      this.socket.emit('send_message', {});
      this.notifi.stopLoading();
      this.chats = result.data;
      this.player = result.user;

      this.scrollToBottom();
    },
    err => {
      this.notifi.stopLoading();
      this.notifi.presentToast('Unable to fetch chat, Please try again','danger');
    });
  }

  send(){
  	if(this.errors.indexOf(this.chat_message) == -1){
      
  		this.add_chat(this.chat_message);
  		this.chats.push({fromId : this._id, toId: this.inboxId, message : this.chat_message, createdAt : new Date() });
  		this.chat_message = '';
      this.scrollToBottom();
      
  	}
  }

  add_chat(message){
    this.apiservice.post('add_chat', {fromId: this._id, toId: this.inboxId, message : message, fromType: 'player', toType: this.type},'').subscribe((res) => { 
      var result;
      result = res;
    	if(result.status == 1){
    		this.socket.connect();
        this.socket.emit('send_message', { _id : result.data, fromId : this._id, message : message, toId : this.inboxId , createdAt : new Date() , user_name : this.alldata.fname[0].toUpperCase()+this.alldata.fname.slice(1)+' '+ this.alldata.lname[0].toUpperCase()+this.alldata.lname.slice(1), user_image : this.alldata.pic });
       
    	}
    },
    err => {
    	console.log(err)
    });
  }

  scrollToBottom() {
  	var self = this;
  	setTimeout(function(){
  		self.content.scrollToBottom(300);
  	},100);
  }

  getUpdates() {
    var self = this;
    let observable = new Observable(observer => {
      self.socket.on('rec_message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

 
  // delete_msg(fake_id, _id,i){
  //   this.notifi.presentLoading();
  //   this.apiservice.post('clearSingleMsg',{toId: this._id,msgId:_id, fake_id: fake_id },'').subscribe((result) => { 
  //   this.notifi.stopLoading();
  //   var res;
  //   res= result;
      
  //       if(res.status==1){
  //         this.chats.splice(i,1);
  //         this.events.publish('read_msgs','');

  //       }else{
  //       }

  //   });
  // }



}

