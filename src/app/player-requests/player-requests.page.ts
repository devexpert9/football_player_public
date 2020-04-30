import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CancelbookingComponent }  from "../cancelbooking/cancelbooking.component";
@Component({
  selector: 'app-player-requests',
  templateUrl: './player-requests.page.html',
  styleUrls: ['./player-requests.page.scss'],
})
export class PlayerRequestsPage implements OnInit {
  title="Requests";
	player_requests:any;
  constructor(public modalController: ModalController) { 
    this.player_requests = "pending";
  }

  ngOnInit() {
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: CancelbookingComponent
    });
    return await modal.present();
  }
  dismiss() {
  
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
