import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular'

@Component({
  selector: 'app-cancelbooking',
  templateUrl: './cancelbooking.component.html',
  styleUrls: ['./cancelbooking.component.scss'],
})
export class CancelbookingComponent implements OnInit {

  constructor(private modalController: ModalController,
    private navParams: NavParams) {
}

  ngOnInit() {}
  async myDismiss() {
    const result: Date = new Date();
    
    await this.modalController.dismiss(result);
  }
}
