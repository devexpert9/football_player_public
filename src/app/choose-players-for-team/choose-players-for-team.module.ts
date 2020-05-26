import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoosePlayersForTeamPageRoutingModule } from './choose-players-for-team-routing.module';

import { ChoosePlayersForTeamPage } from './choose-players-for-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoosePlayersForTeamPageRoutingModule
  ],
  declarations: [ChoosePlayersForTeamPage]
})
export class ChoosePlayersForTeamPageModule {}
