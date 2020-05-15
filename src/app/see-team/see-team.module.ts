import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeeTeamPageRoutingModule } from './see-team-routing.module';

import { SeeTeamPage } from './see-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeeTeamPageRoutingModule
  ],
  declarations: [SeeTeamPage]
})
export class SeeTeamPageModule {}
