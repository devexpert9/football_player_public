import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular'
@Component({
  selector: 'app-match-stats',
  templateUrl: './match-stats.component.html',
  styleUrls: ['./match-stats.component.scss'],
})
export class MatchStatsComponent implements OnInit {

  constructor(private modalController: ModalController,
    private navParams: NavParams) {
}

  ngOnInit() {}

  async myDismiss() {
    const result: Date = new Date();
    
    await this.modalController.dismiss(result);
  }

}
