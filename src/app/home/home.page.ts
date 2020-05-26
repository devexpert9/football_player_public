import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import { NotiService } from '../services/noti/noti.service';
import { config } from '../config'
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title = "Home";
  slideOptsOne = {
    initialSlide: 1,
    speed: 400,
    // autoplay: true,
    // loop: true

  };

  public win: any = window;
  response: any;
  errors: any = ['', null, undefined, 'null', 'undefined', ' '];
  slideOpts: any;
  fileUrl: any = null;
  respData: any;
  userId: any;
  username: any;
  imagedata: any;
  url: any = config.API_URL + 'server/data/match/';
  _id: any = localStorage.getItem('_id');
  matches: any;
  imgpath: any;
  matchlist: any;
  upcominglist: any;
  upcomingres: any;
  searchlist: any;
  searchres: any;
  searching: any = false;
  keyword: any;
  noresults: any = false;
  favres: any;
  favlist: any = [];

  noOfJoinres: any;
  noOfJoindata: any;

  noTodayMatch:any;
  noUpcomingMatch:any;
  skeleton: any = [];
  response1_came: any = false;
  response2_came: any = false;
  constructor(
 
    public TransferObject: FileTransferObject,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public events: Events,
    public apiservice: ApiService,
    public notifi: NotiService,
    public sanitizer: DomSanitizer

  ) {
   
    this.skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 2, 3, 4, 5, 6, 7, 65, 4, 2, 3, 4, 5, 6, 7, 8]
    
    this.events.subscribe('refresh', data => {
      this.ionViewDidEnter();
    })

  }


  ngOnDestroy(){
    this.events.unsubscribe('refresh');
  }

  
  ionViewDidEnter(){
  
    this.favlist = [];
    this.matchlist = [];
    this.upcominglist = [];
    this._id = localStorage.getItem('_id');
    this.response2_came = false;
    this.response1_came = false;
    this.todayMatches();
    this.upcomingMatches();
    this.getfav();

  }
  


  clear(){
    this.favlist = [];
    this.matchlist = [];
    this.upcominglist = [];
    this._id = localStorage.getItem('_id');
    this.response2_came = false;
    this.response1_came = false;
    this.todayMatches();
    this.upcomingMatches();
    this.getfav();
  }

  ngOnInit() {
  }
  todayMatches() {
    this.apiservice.post('todayMatches', {_id: this._id}, '').subscribe((result) => {
      this.response1_came = true;
      this.response = result;
      if (this.response.status == 1) {
        // this.notifi.presentToast(this.response.msg,'success'); 
        this.matchlist = this.response.data;
        this.noTodayMatch = false;
        // console.log(this.matchlist);
      }
      if (this.response.status == 0) {
        this.noTodayMatch = true;
      }

    },
      err => {
        this.response1_came = true;
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured', 'danger');
      });
  }

  upcomingMatches() {
    this.apiservice.post('upcomingMatches', {_id: this._id}, '').subscribe((result) => {
      this.response2_came = true;
      this.notifi.stopLoading();
      this.upcomingres = result;
      if (this.upcomingres.status == 1) {
        // this.notifi.presentToast(this.response.msg,'success'); 
        this.upcominglist = this.upcomingres.data;
        this.noUpcomingMatch = false;


      }
      else if (this.upcomingres.status == 0) {
        this.noUpcomingMatch = true;

      }
    },
      err => {
        this.response2_came = true;
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured', 'danger');
      });

  }

  searchmatch(ev) {

    if (this.errors.indexOf(ev.target.value) == -1) {
      this.keyword = ev.target.value;
      this.searching = true;
      this.apiservice.post('searchmatch', { keyword: ev.target.value, _id : this._id }, '').subscribe((result) => {
        this.notifi.stopLoading();
        this.searchres = result;
        if (this.searchres.status == 1) {
          this.noUpcomingMatch =false;
          this.noTodayMatch =false;
          this.noresults = false;
          this.upcominglist = this.searchres.data;
        }
        else {

          this.noresults = true;
        }
      },
        err => {
          this.notifi.stopLoading();
          this.notifi.presentToast('Internal server error, Please try later', 'danger');
        });

    } else {

      this.noresults = false;
      this.noresults = false;
      this.searching = false;
      this.upcomingMatches();

    }

  }

  addfav(match_id, status) {

    this.apiservice.post('p_addfav', { _id: this._id, match_id: match_id, status: status }, '').subscribe((result) => {
      this.notifi.stopLoading();
      this.searchres = result;
      if (this.searchres.status == 1) {
        if (status == 0) {

          const index = this.favlist.indexOf(match_id);
          if (index > -1) {
            this.favlist.splice(index, 1);
          }
          this.notifi.presentToast('Removed from favourite', 'danger');
        }
        else if (status == 1) {
          this.favlist.push(match_id);
          this.notifi.presentToast('Added to favourite', 'success');
        }


      }
      else {
        // this.notifi.presentToast(this.searchres.msg,'danger');
      }
    },
      err => {
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured', 'danger');
      });
  }

  getfav() {
    this.notifi.stopLoading();
    this.apiservice.post('p_getfav', { _id: this._id }, '').subscribe((result) => {
      this.notifi.stopLoading();
      this.favres = result;

      if (this.favres.status == 1) {
        // this.notifi.presentToast(this.response.msg,'success'); 
        this.favlist = [];
        for (let key of this.favres.data) {
          this.favlist.push(key._id);

        }

        console.log(this.favlist);

      }

    },
      err => {
        this.notifi.stopLoading();
        this.notifi.presentToast('Internal error occured', 'danger');
      });
  }

  next(i) {
    this.router.navigate([' /match-details/' + i]);

  }
}
