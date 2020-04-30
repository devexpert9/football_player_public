import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavouritePropertiesPageRoutingModule } from './favourite-properties-routing.module';

import { FavouritePropertiesPage } from './favourite-properties.page';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavouritePropertiesPageRoutingModule,
    SharedModule
  ],
  declarations: [FavouritePropertiesPage]
})
export class FavouritePropertiesPageModule {}
