import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchDetailsPageRoutingModule } from './match-details-routing.module';

import { MatchDetailsPage } from './match-details.page';
import { NgxStarsModule } from 'ngx-stars';
import { FeespayComponent  } from "../feespay/feespay.component";
import { SharedModule } from "../shared/shared.module";
@NgModule({
  imports: [
    NgxStarsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatchDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [MatchDetailsPage,FeespayComponent],
  entryComponents:[FeespayComponent]
})
export class MatchDetailsPageModule {}
