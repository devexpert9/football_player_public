import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotingPlayersPage } from './voting-players.page';

const routes: Routes = [
  {
    path: '',
    component: VotingPlayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotingPlayersPageRoutingModule {}
