import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectFavComponent } from "../select-fav/select-fav.component";
import { CancelmatchComponent } from '../cancelmatch/cancelmatch.component';
@Component({
  selector: 'app-upcoming-matchdetails',
  templateUrl: './upcoming-matchdetails.page.html',
  styleUrls: ['./upcoming-matchdetails.page.scss'],
})
export class UpcomingMatchdetailsPage implements OnInit {
	title="Club 1 Vs Club 2";
    constructor(public modalController: ModalController) {      
    
  }

  ngOnInit() {
  }
   async presentModal2() {
    const modal = await this.modalController.create({
      component: CancelmatchComponent
    });
    return await modal.present();
  }
 async presentModal() {
    const modal = await this.modalController.create({
      component: SelectFavComponent
    });
    return await modal.present();
  }
}
