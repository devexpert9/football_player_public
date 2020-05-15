import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotingPageRoutingModule } from './voting-routing.module';
import { SharedModule } from "../shared/shared.module";
import { VotingPage } from './voting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotingPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [VotingPage]
})
export class VotingPageModule {}
