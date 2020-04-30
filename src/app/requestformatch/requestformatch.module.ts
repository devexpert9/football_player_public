import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestformatchPageRoutingModule } from './requestformatch-routing.module';

import { RequestformatchPage } from './requestformatch.page';
import { SharedModule } from "../shared/shared.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    RequestformatchPageRoutingModule
  ],
  declarations: [RequestformatchPage]
})
export class RequestformatchPageModule {}
