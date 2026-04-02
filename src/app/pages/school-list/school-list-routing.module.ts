import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolListPage } from './school-list.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolListPageRoutingModule {}
