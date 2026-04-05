import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { School } from '../../models/school.model';
import { FavoritesService } from '../../services/favorites.service';
import { AppLanguage, LanguageService } from '../../services/language.service';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false,
})
export class FavoritesPage implements OnInit, OnDestroy {
  favoriteSchools: School[] = [];
  isLoading = true;
  errorMessage = '';
  language: AppLanguage = 'en';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly schoolService: SchoolService,
    private readonly favoritesService: FavoritesService,
    private readonly languageService: LanguageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => (this.language = language));

    this.loadFavoriteSchools();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewWillEnter(): void {
    this.loadFavoriteSchools();
  }

  retry(): void {
    this.loadFavoriteSchools();
  }

  getTitle(): string {
    return this.language === 'zh' ? '我的收藏' : 'Favorites';
  }

  getLoadingText(): string {
    return this.language === 'zh' ? '載入收藏學校中...' : 'Loading favorite schools...';
  }

  getRetryText(): string {
    return this.language === 'zh' ? '重試' : 'Retry';
  }

  getEmptyText(): string {
    return this.language === 'zh' ? '暫時沒有收藏學校。' : 'No favorite schools yet.';
  }

  getDisplayName(school: School): string {
    if (this.language === 'zh') {
      return school.chineseName || school.englishName || '未知學校';
    }

    return school.englishName || school.chineseName || 'Unknown School';
  }

  getDistrictLabel(): string {
    return this.language === 'zh' ? '分區' : 'District';
  }

  getDisplayDistrict(school: School): string {
    return this.language === 'zh' ? school.districtZh || school.districtEn : school.districtEn || school.districtZh;
  }

  getAddressLabel(): string {
    return this.language === 'zh' ? '地址' : 'Address';
  }

  getDisplayAddress(school: School): string {
    return this.language === 'zh'
      ? school.chineseAddress || school.englishAddress
      : school.englishAddress || school.chineseAddress;
  }

  openSchoolDetail(school: School): void {
    this.router.navigate(['/school-detail', school.id], {
      state: { school },
    });
  }

  private loadFavoriteSchools(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const favoriteIds = new Set(this.favoritesService.getFavoriteIds());
    if (favoriteIds.size === 0) {
      this.favoriteSchools = [];
      this.isLoading = false;
      return;
    }

    this.schoolService.getSchools().subscribe({
      next: (schools) => {
        this.favoriteSchools = schools.filter((school) => school.id && favoriteIds.has(school.id));
        this.isLoading = false;
      },
      error: () => {
        this.favoriteSchools = [];
        this.errorMessage =
          this.language === 'zh' ? '未能載入收藏學校，請稍後再試。' : 'Failed to load favorite schools. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
