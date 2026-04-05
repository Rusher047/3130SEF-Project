import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistrictSchoolsPageRoutingModule } from './district-schools-routing.module';

import { DistrictSchoolsPage } from './district-schools.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistrictSchoolsPageRoutingModule
  ],
  declarations: [DistrictSchoolsPage]
})
export class DistrictSchoolsPageModule {}
