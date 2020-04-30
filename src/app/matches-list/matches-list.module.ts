import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesListPageRoutingModule } from './matches-list-routing.module';

import { MatchesListPage } from './matches-list.page';
import { FeespayComponent  } from "../feespay/feespay.component";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchesListPageRoutingModule,
    SharedModule
  ],
  declarations: [MatchesListPage],
  entryComponents:[]
})
export class MatchesListPageModule {}
