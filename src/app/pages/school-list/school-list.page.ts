import { Component, OnInit } from '@angular/core';

import { School } from '../../models/school.model';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.page.html',
  styleUrls: ['./school-list.page.scss'],
  standalone: false,
})
export class SchoolListPage implements OnInit {
  schools: School[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly schoolService: SchoolService) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  retry(): void {
    this.loadSchools();
  }

  getDisplayName(school: School): string {
    return school.nameZh || school.nameEn || 'Unknown School';
  }

  getDisplayAddress(school: School): string {
    return school.addressZh || school.addressEn || '';
  }

  getDisplayLevelOrType(school: School): string {
    return school.schoolLevel || school.schoolType || '';
  }

  private loadSchools(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.schoolService.getSchools().subscribe({
      next: (schools) => {
        this.schools = schools;
        this.isLoading = false;
      },
      error: () => {
        this.schools = [];
        this.isLoading = false;
        this.errorMessage = '未能載入學校資料，請稍後再試。';
      },
    });
  }
}
