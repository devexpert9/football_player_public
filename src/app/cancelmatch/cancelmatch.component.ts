import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular'
@Component({
  selector: 'app-cancelmatch',
  templateUrl: './cancelmatch.component.html',
  styleUrls: ['./cancelmatch.component.scss'],
})
export class CancelmatchComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
async myDismiss() {
    const result: Date = new Date();
    
    await this.modalController.dismiss(result);
  }
}
