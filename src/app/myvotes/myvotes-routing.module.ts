import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyvotesPage } from './myvotes.page';

const routes: Routes = [
  {
    path: '',
    component: MyvotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyvotesPageRoutingModule {}
