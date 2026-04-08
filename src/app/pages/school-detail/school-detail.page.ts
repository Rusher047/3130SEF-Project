import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { School } from '../../models/school.model';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService, AppLanguage } from '../../services/language.service';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-school-detail',
  templateUrl: './school-detail.page.html',
  styleUrls: ['./school-detail.page.scss'],
  standalone: false,
})
export class SchoolDetailPage implements OnInit, OnDestroy {
  school: School | null = null;
  isFavorite: boolean = false;
  language: AppLanguage = 'en';
  isLoading = true;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly schoolService: SchoolService,
    private readonly languageService: LanguageService,
    private readonly favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    // Initialize Language
    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        this.language = language;
      });

    // Get School ID from URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      this.errorMessage = 'Invalid ID';
      return;
    }

    // Fetch school data
    this.schoolService.getSchools().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.school = data.find(s => s.id === id) || null;
        if (this.school) {
          this.isFavorite = this.favoritesService.isFavorite(this.school.id);
        } else {
          this.errorMessage = this.language === 'zh' ? '找不到學校' : 'School not found';
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'API Error';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- HTML GETTERS (Fixes the current errors) ---

  getDisplayName(): string {
    if (!this.school) return '';
    return this.language === 'zh' 
      ? (this.school.chineseName || this.school.englishName) 
      : (this.school.englishName || this.school.chineseName);
  }

  getFavoriteButtonText(): string {
    if (this.isFavorite) {
      return this.language === 'zh' ? '從最愛移除' : 'Remove from Favorites';
    }
    return this.language === 'zh' ? '加入最愛' : 'Add to Favorites';
  }

  getTitle(): string {
    return this.language === 'zh' ? '學校詳情' : 'School Detail';
  }

  getLoadingText(): string {
    return this.language === 'zh' ? '載入中...' : 'Loading...';
  }

  getBackText(): string {
    return this.language === 'zh' ? '返回' : 'Back';
  }

  getOpenWebsiteText(): string {
    return this.language === 'zh' ? '開啟網頁' : 'Open Website';
  }

  getDisplayAddress(): string {
    if (!this.school) return '';
    return this.language === 'zh' ? this.school.chineseAddress : this.school.englishAddress;
  }

  hasValue(value: any): boolean {
    return value !== null && value !== undefined && value.toString().trim().length > 0;
  }

  hasWebsite(): boolean {
    return this.hasValue(this.school?.websiteEn || this.school?.websiteZh);
  }

  // --- ACTIONS ---

  goBack() {
    // Checks where to go back to
    this.router.navigate(['/search']);
  }

  openWebsite() {
    let url = this.school?.websiteEn || this.school?.websiteZh;
    if (url) {
      url = url.trim();
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(finalUrl, '_blank');
    }
  }

  toggleFavorite() {
    if (this.school) {
      this.favoritesService.toggleFavorite(this.school);
      this.isFavorite = this.favoritesService.isFavorite(this.school.id);
    }
  }
}