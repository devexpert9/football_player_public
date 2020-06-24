import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllchatsPage } from './allchats.page';

const routes: Routes = [
  {
    path: '',
    component: AllchatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllchatsPageRoutingModule {}
