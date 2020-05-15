import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyvotesPageRoutingModule } from './myvotes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MyvotesPage } from './myvotes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyvotesPageRoutingModule,
    SharedModule
  ],
  declarations: [MyvotesPage]
})
export class MyvotesPageModule {}
