import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FollowingPageRoutingModule } from './following-routing.module';

import { FollowingPage } from './following.page';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
	SharedModule,
    FollowingPageRoutingModule
  ],  
  declarations: [FollowingPage]
})
export class FollowingPageModule {}
