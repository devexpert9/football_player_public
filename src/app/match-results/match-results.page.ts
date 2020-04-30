import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatchStatsComponent } from "../match-stats/match-stats.component";

@Component({
  selector: 'app-match-results',
  templateUrl: './match-results.page.html',
  styleUrls: ['./match-results.page.scss'],
})
export class MatchResultsPage implements OnInit {

  constructor(public modalController: ModalController) { }
  title ="Match Results";
  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: MatchStatsComponent
    });
    return await modal.present();
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
