import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesListPage } from './matches-list.page';

const routes: Routes = [
  {
    path: '',
    component: MatchesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchesListPageRoutingModule {}
