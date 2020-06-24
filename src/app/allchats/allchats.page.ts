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
  selector: 'app-allchats',
  templateUrl: './allchats.page.html',
  styleUrls: ['./allchats.page.scss'],
})
export class AllchatsPage implements OnInit {
  public win: any = window;
@ViewChild('content',{static : true}) private content: any;
title:any='Inbox'
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
_id:any;
purl:any=config.API_URL+'server/data/p_pics/'; 
property:any=config.API_URL+'server/data/pic/'; 
skeleton:any;
response_came:any;
no_inbox:any;
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
              this.skeleton=[1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,65,4,2,3,4,5,6,7,8]
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.no_inbox = '';
    this.toId ='';
    this.chat_message =''; 
    this.chats =[];
    this.response_came ='';
    this._id= localStorage.getItem('_id');
  	this.getChat();
  }

  getChat(){
   
    this.apiservice.post('get_all_chats', {_id : this._id, my_type: 'player'},'').subscribe((res) => {
      this.response_came = true;
      var result;
      result = res;
      if(result.status ==1){
        this.events.publish('read_msgs','');
        this.chats = result.data;
      }else{
        this.no_inbox = true;
      }

      
    },
    err => {
       this.response_came = true;
     
      this.notifi.presentToast('Unable to fetch chat, Please try again','danger');
    });
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
}


