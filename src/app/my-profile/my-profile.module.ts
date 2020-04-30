import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipsModule } from 'ionic-tooltips';
import { IonicModule } from '@ionic/angular';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { MyProfilePageRoutingModule } from './my-profile-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MyProfilePage } from './my-profile.page';
import { SharedModule } from "../shared/shared.module";
@NgModule({
  imports: [
    Ng4GeoautocompleteModule.forRoot(),
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    MyProfilePageRoutingModule,
    ReactiveFormsModule,
    TooltipsModule.forRoot()
  ],
  declarations: [MyProfilePage]
})
export class MyProfilePageModule {}
