import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopupPlayersPageRoutingModule } from './popup-players-routing.module';

import { PopupPlayersPage } from './popup-players.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopupPlayersPageRoutingModule
  ],
  declarations: []
})
export class PopupPlayersPageModule {}
