import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolDetailPageRoutingModule } from './school-detail-routing.module';

import { SchoolDetailPage } from './school-detail.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SchoolDetailPageRoutingModule],
  declarations: [SchoolDetailPage],
})
export class SchoolDetailPageModule {}
