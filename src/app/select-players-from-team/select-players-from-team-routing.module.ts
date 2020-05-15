import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPlayersFromTeamPage } from './select-players-from-team.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPlayersFromTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPlayersFromTeamPageRoutingModule {}
