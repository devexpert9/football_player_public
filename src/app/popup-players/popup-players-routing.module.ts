import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupPlayersPage } from './popup-players.page';

const routes: Routes = [
  {
    path: '',
    component: PopupPlayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupPlayersPageRoutingModule {}
