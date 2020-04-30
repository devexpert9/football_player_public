import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PaymentPage } from './payment.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}
