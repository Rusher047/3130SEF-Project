import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolDetailPage } from './school-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolDetailPageRoutingModule {}
