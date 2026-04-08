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
    private readonly favoritesService: FavoritesService // Correct naming
  ) {}

  ngOnInit() {
    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((l) => this.language = l);

    const id = this.route.snapshot.paramMap.get('id');
    
    this.schoolService.getSchools().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.school = data.find(s => s.id === id) || null;
        if (this.school) {
          // Check if this school is already hearted
          this.isFavorite = this.favoritesService.isFavorite(this.school.id);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error loading data';
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavorite() {
    if (this.school) {
      // 1. Update the Service
      this.isFavorite = this.favoritesService.toggleFavorite(this.school);
      console.log('Favorite toggled. Current state:', this.isFavorite);
    }
  }

  getFavoriteButtonText() {
    if (this.isFavorite) {
      return this.language === 'zh' ? '從最愛移除' : 'Remove from Favorites';
    }
    return this.language === 'zh' ? '加入最愛' : 'Add to Favorites';
  }

  getDisplayName(): string {
    if (!this.school) return '';
    return this.language === 'zh' ? this.school.chineseName : this.school.englishName;
  }

  getDisplayAddress(): string {
    if (!this.school) return '';
    return this.language === 'zh' ? this.school.chineseAddress : this.school.englishAddress;
  }

  getTitle() { return this.language === 'zh' ? '學校詳情' : 'School Detail'; }
  getLoadingText() { return this.language === 'zh' ? '載入中...' : 'Loading...'; }
  getBackText() { return this.language === 'zh' ? '返回' : 'Back'; }
  getOpenWebsiteText() { return this.language === 'zh' ? '開啟網頁' : 'Open Website'; }
  
  hasValue(val: any) { return val && val.toString().trim().length > 0; }
  hasWebsite() { return this.hasValue(this.school?.websiteEn || this.school?.websiteZh); }

  goBack() { this.router.navigate(['/search']); }
  
  openWebsite() {
    const url = this.school?.websiteEn || this.school?.websiteZh;
    if (url) window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  }
}