import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchResultsPageRoutingModule } from './match-results-routing.module';

import { MatchResultsPage } from './match-results.page';
import { MatchStatsComponent } from "../match-stats/match-stats.component";
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MatchResultsPageRoutingModule
  ],
  declarations: [MatchResultsPage,MatchStatsComponent],
  entryComponents: [MatchStatsComponent]

})
export class MatchResultsPageModule {}
