import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotingPlayersPageRoutingModule } from './voting-players-routing.module';

import { VotingPlayersPage } from './voting-players.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotingPlayersPageRoutingModule
  ],
  declarations: []
})
export class VotingPlayersPageModule {}
