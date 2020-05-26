import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoosePlayersForTeamPage } from './choose-players-for-team.page';

const routes: Routes = [
  {
    path: '',
    component: ChoosePlayersForTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoosePlayersForTeamPageRoutingModule {}
