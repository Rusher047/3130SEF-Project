import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { School } from '../../models/school.model';
import { AppLanguage, LanguageService } from '../../services/language.service';
import { SchoolService } from '../../services/school.service';

interface DistrictOption {
  key: string;
  labelEn: string;
  labelZh: string;
}

interface SchoolLevelOption {
  key: string;
  labelEn: string;
  labelZh: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})

export class SearchPage implements OnInit, OnDestroy {
  schools: School[] = [];
  filteredSchools: School[] = [];
  districtOptions: DistrictOption[] = [];
  levelOptions: SchoolLevelOption[] = [];
  searchText = '';
  selectedDistrictKey = '__all__';
  selectedLevelKey = '__all__';
  isLoading = true;
  errorMessage = '';
  language: AppLanguage = 'en';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly schoolService: SchoolService,
    private readonly languageService: LanguageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => (this.language = language));

    this.loadSchools();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  retry(): void {
    this.loadSchools();
  }

  getTitle(): string {
    return this.language === 'zh' ? '學校列表' : 'School List';
  }

  getDisplayName(school: School): string {
    return this.language === 'zh'
      ? school.chineseName || '未知學校'
      : school.englishName || 'Unknown School';
  }

  getDisplayDistrict(school: School): string {
    return this.language === 'zh' ? school.districtZh : school.districtEn;
  }

  getDisplayAddress(school: School): string {
    return this.language === 'zh' ? school.chineseAddress : school.englishAddress;
  }

  getDisplayLevelOrType(school: School): string {
    return this.language === 'zh'
      ? school.schoolTypeZh || school.chineseCategory
      : school.schoolLevelEn || school.englishCategory;
  }

  getDistrictLabel(): string {
    return this.language === 'zh' ? '分區' : 'District';
  }

  getAddressLabel(): string {
    return this.language === 'zh' ? '地址' : 'Address';
  }

  getTypeLabel(): string {
    return this.language === 'zh' ? '類型' : 'Type';
  }

  getLoadingText(): string {
    return this.language === 'zh' ? '載入學校資料中...' : 'Loading schools...';
  }

  getRetryText(): string {
    return this.language === 'zh' ? '重試' : 'Retry';
  }

  getEmptyText(): string {
    return this.language === 'zh' ? '沒有學校資料。' : 'No schools found.';
  }

  getNoSearchResultText(): string {
    return this.language === 'zh' ? '沒有符合搜尋或篩選條件的學校。' : 'No schools match your search or filter.';
  }

  getAllDistrictsText(): string {
    return this.language === 'zh' ? '全部分區' : 'All Districts';
  }

  getDistrictFilterLabel(): string {
    return this.language === 'zh' ? '按分區篩選' : 'Filter by district';
  }

  getAllLevelsText(): string {
    return this.language === 'zh' ? '全部學校類型' : 'All School Levels';
  }

  getLevelFilterLabel(): string {
    return this.language === 'zh' ? '按學校類型篩選' : 'Filter by school level';
  }

  onSearchInput(event: Event): void {
    const inputEvent = event as CustomEvent<{ value?: string }>;
    this.searchText = inputEvent.detail?.value ?? '';
    this.applyFilters();
  }

  onDistrictChange(event: Event): void {
    const changeEvent = event as CustomEvent<{ value?: string }>;
    this.selectedDistrictKey = changeEvent.detail?.value || '__all__';
    this.applyFilters();
  }

  onLevelChange(event: Event): void {
    const changeEvent = event as CustomEvent<{ value?: string }>;
    this.selectedLevelKey = changeEvent.detail?.value || '__all__';
    this.applyFilters();
  }

  getDistrictOptionText(option: DistrictOption): string {
    if (this.language === 'zh') {
      return option.labelZh || option.labelEn;
    }

    return option.labelEn || option.labelZh;
  }

  getLevelOptionText(option: SchoolLevelOption): string {
    if (this.language === 'zh') {
      return option.labelZh || option.labelEn;
    }

    return option.labelEn || option.labelZh;
  }

  openSchoolDetail(school: School): void {
    this.router.navigate(['/school-detail', school.id], {
      state: { school },
    });
  }

  private loadSchools(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.schoolService.getSchools().subscribe({
      next: (schools) => {
        this.schools = schools;
        this.districtOptions = this.buildDistrictOptions(schools);
        this.levelOptions = this.buildLevelOptions(schools);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.schools = [];
        this.filteredSchools = [];
        this.districtOptions = [];
        this.levelOptions = [];
        this.selectedDistrictKey = '__all__';
        this.selectedLevelKey = '__all__';
        this.isLoading = false;
        this.errorMessage =
          this.language === 'zh' ? '未能載入學校資料，請稍後再試。' : 'Failed to load school data. Please try again.';
      },
    });
  }

  private applyFilters(): void {
    const keyword = this.searchText.trim().toLowerCase();
    this.filteredSchools = this.schools.filter((school) => {
      const englishName = (school.englishName || '').toLowerCase();
      const chineseName = (school.chineseName || '').toLowerCase();
      const matchedKeyword = !keyword || englishName.includes(keyword) || chineseName.includes(keyword);
      const districtKey = this.getDistrictKey(school);
      const matchedDistrict = this.selectedDistrictKey === '__all__' || districtKey === this.selectedDistrictKey;
      const levelKey = this.getSchoolLevelKey(school);
      const matchedLevel = this.selectedLevelKey === '__all__' || levelKey === this.selectedLevelKey;

      return matchedKeyword && matchedDistrict && matchedLevel;
    });
  }

  private buildDistrictOptions(schools: School[]): DistrictOption[] {
    const options = new Map<string, DistrictOption>();
    schools.forEach((school) => {
      const key = this.getDistrictKey(school);
      if (!key) {
        return;
      }

      if (!options.has(key)) {
        options.set(key, {
          key,
          labelEn: (school.districtEn || '').trim(),
          labelZh: (school.districtZh || '').trim(),
        });
      }
    });

    return Array.from(options.values()).sort((a, b) =>
      (a.labelEn || a.labelZh || '').localeCompare(b.labelEn || b.labelZh || '')
    );
  }

  private getDistrictKey(school: School): string {
    return (school.districtEn || school.districtZh || '').trim();
  }

  private buildLevelOptions(schools: School[]): SchoolLevelOption[] {
    const options = new Map<string, SchoolLevelOption>();

    schools.forEach((school) => {
      const key = this.getSchoolLevelKey(school);
      if (!key) {
        return;
      }

      if (!options.has(key)) {
        options.set(key, this.createLevelOption(key));
      }
    });

    return Array.from(options.values()).sort((a, b) => a.labelEn.localeCompare(b.labelEn));
  }

  private getSchoolLevelKey(school: School): string {
    const englishLevel = (school.schoolLevelEn || '').trim().toUpperCase();
    if (englishLevel) {
      return englishLevel;
    }

    const chineseType = (school.schoolTypeZh || '').trim();
    const chineseToEnglish: Record<string, string> = {
      幼稚園: 'KINDERGARTEN',
      幼稚園暨幼兒中心: 'KINDERGARTEN-CUM-CHILD CARE CENTRES',
      小學: 'PRIMARY',
      中學: 'SECONDARY',
    };

    return chineseToEnglish[chineseType] || '';
  }

  private createLevelOption(levelKey: string): SchoolLevelOption {
    const levelMap: Record<string, SchoolLevelOption> = {
      KINDERGARTEN: { key: 'KINDERGARTEN', labelEn: 'KINDERGARTEN', labelZh: '幼稚園' },
      'KINDERGARTEN-CUM-CHILD CARE CENTRES': {
        key: 'KINDERGARTEN-CUM-CHILD CARE CENTRES',
        labelEn: 'KINDERGARTEN-CUM-CHILD CARE CENTRES',
        labelZh: '幼稚園暨幼兒中心',
      },
      PRIMARY: { key: 'PRIMARY', labelEn: 'PRIMARY', labelZh: '小學' },
      SECONDARY: { key: 'SECONDARY', labelEn: 'SECONDARY', labelZh: '中學' },
    };

    return levelMap[levelKey] || { key: levelKey, labelEn: levelKey, labelZh: levelKey };
  }
}
