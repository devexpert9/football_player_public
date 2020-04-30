import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { OwnerProfilePageRoutingModule } from './owner-profile-routing.module';

import { OwnerProfilePage } from './owner-profile.page';
import { RequestFieldComponent } from "../request-field/request-field.component";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
  import { from } from 'rxjs';
  import { SharedModule } from "../shared/shared.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OwnerProfilePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OwnerProfilePage,RequestFieldComponent],
  entryComponents: [RequestFieldComponent]
})
export class OwnerProfilePageModule {}
