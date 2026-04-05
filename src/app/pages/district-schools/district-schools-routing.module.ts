import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistrictSchoolsPage } from './district-schools.page';

const routes: Routes = [
  {
    path: '',
    component: DistrictSchoolsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistrictSchoolsPageRoutingModule {}
