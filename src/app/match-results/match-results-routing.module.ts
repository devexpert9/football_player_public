import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchResultsPage } from './match-results.page';

const routes: Routes = [
  {
    path: '',
    component: MatchResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchResultsPageRoutingModule {}
