import { Component, OnInit } from '@angular/core';
import { Events, ActionSheetController, Platform } from '@ionic/angular';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.page.html',
  styleUrls: ['./network-error.page.scss'],
})
export class NetworkErrorPage implements OnInit {

  constructor(
    public events:Events,
    private modalController: ModalController) {
    this.events.subscribe('connected', data => {
      this.modalController.dismiss();
  
    })
   }

  ngOnInit() {
  }


}
