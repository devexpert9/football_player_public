import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminsPageRoutingModule } from './admins-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminsPage } from './admins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminsPageRoutingModule,
    SharedModule
  ],
  declarations: [AdminsPage]
})
export class AdminsPageModule {}
