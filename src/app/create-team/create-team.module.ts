import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTeamPageRoutingModule } from './create-team-routing.module';
import { SharedModule } from "../shared/shared.module";
import { CreateTeamPage } from './create-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTeamPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [CreateTeamPage]
})
export class CreateTeamPageModule {}
