import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchDetailsPage } from './match-details.page';

const routes: Routes = [
  {
    path: '',
    component: MatchDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchDetailsPageRoutingModule {}
