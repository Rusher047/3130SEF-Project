import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { School } from '../../models/school.model';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService, AppLanguage } from '../../services/language.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false
})
export class FavoritesPage implements OnInit {

  favoriteSchools: School[] = [];
  isLoading = false;
  errorMessage = '';
  language: AppLanguage = 'en';

  constructor(
    private favoritesService: FavoritesService,
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.language = this.languageService.currentLanguage;
    this.loadData();
  }

  ionViewWillEnter() {
    this.language = this.languageService.currentLanguage;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    try {
      this.favoriteSchools = this.favoritesService.getFavorites();
      this.isLoading = false;
    } catch (e) {
      this.errorMessage = this.language === 'zh' ? '發生錯誤' : 'An error occurred';
      this.isLoading = false;
    }
  }

  retry() {
    this.loadData();
  }


  getTitle(): string {
    return this.language === 'zh' ? '我的最愛' : 'My Favorites';
  }

  getLoadingText(): string {
    return this.language === 'zh' ? '載入中...' : 'Loading...';
  }

  getRetryText(): string {
    return this.language === 'zh' ? '重試' : 'Retry';
  }

  getEmptyText(): string {
    return this.language === 'zh' ? '尚未添加最愛學校' : 'No favorite schools added yet.';
  }

  getDistrictLabel(): string {
    return this.language === 'zh' ? '地區' : 'District';
  }

  getAddressLabel(): string {
    return this.language === 'zh' ? '地址' : 'Address';
  }

  getDisplayDistrict(school: School): string {
    return this.language === 'zh' ? school.districtZh : school.districtEn;
  }

  getDisplayAddress(school: School): string {
    return this.language === 'zh' ? school.chineseAddress : school.englishAddress;
  }

  getDisplayName(school: School): string {
    return this.language === 'zh' ? school.chineseName : school.englishName;
  }


  openSchoolDetail(school: School) {
    this.router.navigate(['/school-detail', school.id]);
  }

  removeFavorite(event: Event, school: School) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(school);
    this.loadData();
  }
}