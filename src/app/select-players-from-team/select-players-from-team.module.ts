import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPlayersFromTeamPageRoutingModule } from './select-players-from-team-routing.module';

import { SelectPlayersFromTeamPage } from './select-players-from-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPlayersFromTeamPageRoutingModule
  ],
  declarations: []
})
export class SelectPlayersFromTeamPageModule {}
