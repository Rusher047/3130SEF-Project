import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistrictSchoolsPage } from './district-schools.page';

describe('DistrictSchoolsPage', () => {
  let component: DistrictSchoolsPage;
  let fixture: ComponentFixture<DistrictSchoolsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictSchoolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
