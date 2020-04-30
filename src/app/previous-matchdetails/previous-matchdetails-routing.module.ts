import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviousMatchdetailsPage } from './previous-matchdetails.page';

const routes: Routes = [
  {
    path: '',
    component: PreviousMatchdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviousMatchdetailsPageRoutingModule {}
