import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeeTeamPage } from './see-team.page';

const routes: Routes = [
  {
    path: '',
    component: SeeTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeeTeamPageRoutingModule {}
