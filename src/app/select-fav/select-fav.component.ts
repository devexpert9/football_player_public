import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular'
@Component({
  selector: 'app-select-fav',
  templateUrl: './select-fav.component.html',
  styleUrls: ['./select-fav.component.scss'],
})
export class SelectFavComponent implements OnInit {

  constructor(private modalController: ModalController,
    private navParams: NavParams) {
}

  ngOnInit() {}
  async myDismiss() {
    const result: Date = new Date();
    
    await this.modalController.dismiss(result);
  }

}
