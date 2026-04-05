import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { School } from '../../models/school.model';
import { FavoritesService } from '../../services/favorites.service';
import { AppLanguage, LanguageService } from '../../services/language.service';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-school-detail',
  templateUrl: './school-detail.page.html',
  styleUrls: ['./school-detail.page.scss'],
  standalone: false,
})
export class SchoolDetailPage implements OnInit, OnDestroy {
  school: School | null = null;
  websiteUrl: string | null = null;
  isFavorite = false;
  isLoading = true;
  errorMessage = '';
  language: AppLanguage = 'en';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly schoolService: SchoolService,
    private readonly languageService: LanguageService,
    private readonly favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => (this.language = language));

    const stateSchool = this.readSchoolFromState();
    if (stateSchool) {
      this.school = stateSchool;
      this.updateWebsiteUrl();
      this.updateFavoriteState();
      this.isLoading = false;
      return;
    }

    const schoolId = this.route.snapshot.paramMap.get('id') || '';
    if (!schoolId) {
      this.errorMessage = this.language === 'zh' ? '找不到學校資料。' : 'School data not found.';
      this.isLoading = false;
      return;
    }

    this.schoolService.getSchools().subscribe({
      next: (schools) => {
        this.school = schools.find((item) => item.id === schoolId) || null;
        if (!this.school) {
          this.errorMessage = this.language === 'zh' ? '找不到學校資料。' : 'School data not found.';
          this.websiteUrl = null;
          this.isFavorite = false;
        } else {
          this.updateWebsiteUrl();
          this.updateFavoriteState();
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = this.language === 'zh' ? '未能載入學校資料。' : 'Failed to load school data.';
        this.websiteUrl = null;
        this.isFavorite = false;
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/school-list']);
  }

  getTitle(): string {
    return this.language === 'zh' ? '學校詳情' : 'School Detail';
  }

  getDisplayName(): string {
    if (!this.school) {
      return this.language === 'zh' ? '未知學校' : 'Unknown School';
    }

    return this.language === 'zh'
      ? this.school.chineseName || '未知學校'
      : this.school.englishName || 'Unknown School';
  }

  getDisplayAddress(): string {
    if (!this.school) {
      return '';
    }

    return this.language === 'zh' ? this.school.chineseAddress : this.school.englishAddress;
  }

  getLoadingText(): string {
    return this.language === 'zh' ? '載入學校資料中...' : 'Loading school details...';
  }

  getBackText(): string {
    return this.language === 'zh' ? '返回列表' : 'Back to List';
  }

  hasValue(value: string | null | undefined): boolean {
    return !!value && value.trim().length > 0;
  }

  hasWebsite(): boolean {
    return !!this.websiteUrl;
  }

  getOpenWebsiteText(): string {
    return this.language === 'zh' ? '開啟網頁' : 'Open Website';
  }

  getFavoriteButtonText(): string {
    if (this.isFavorite) {
      return this.language === 'zh' ? '取消收藏' : 'Unfavorite';
    }

    return this.language === 'zh' ? '加入收藏' : 'Favorite';
  }

  openWebsite(): void {
    if (!this.websiteUrl) {
      return;
    }

    window.open(this.websiteUrl, '_blank', 'noopener,noreferrer');
  }

  toggleFavorite(): void {
    const schoolId = this.school?.id || '';
    if (!schoolId) {
      return;
    }

    this.isFavorite = this.favoritesService.toggleFavorite(schoolId);
  }

  private readSchoolFromState(): School | null {
    const currentNavState = this.router.getCurrentNavigation()?.extras?.state?.['school'] as School | undefined;
    if (currentNavState) {
      return currentNavState;
    }

    const historyState = history.state?.school as School | undefined;
    return historyState || null;
  }

  private updateWebsiteUrl(): void {
    const rawWebsite = this.school?.websiteEn || this.school?.websiteZh || this.school?.website || '';
    this.websiteUrl = this.normalizeWebsiteUrl(rawWebsite);
  }

  private updateFavoriteState(): void {
    const schoolId = this.school?.id || '';
    this.isFavorite = schoolId ? this.favoritesService.isFavorite(schoolId) : false;
  }

  private normalizeWebsiteUrl(rawUrl: string): string | null {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      return null;
    }

    const withProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
      const parsed = new URL(withProtocol);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }
}
