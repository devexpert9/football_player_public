import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerProfilePage } from './owner-profile.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerProfilePageRoutingModule {}
