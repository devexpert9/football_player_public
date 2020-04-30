import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestformatchPage } from './requestformatch.page';

const routes: Routes = [
  {
    path: '',
    component: RequestformatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestformatchPageRoutingModule {}
