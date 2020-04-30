import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamInvitationsPage } from './team-invitations.page';

const routes: Routes = [
  {
    path: '',
    component: TeamInvitationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamInvitationsPageRoutingModule {}
