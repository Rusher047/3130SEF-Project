import { Component, OnInit } from '@angular/core';
import { School } from '../../models/school.model';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { LanguageService, AppLanguage } from '../../services/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user: any = null;
  favorites: School[] = [];
  language: AppLanguage = 'en';

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService, 
    private langService: LanguageService
  ) { }

  ngOnInit() {
    this.refreshData();
  }

  ionViewWillEnter() {
    this.refreshData();
  }

  refreshData() {
    this.language = this.langService.currentLanguage;
    this.user = this.authService.getUser();
    this.favorites = this.favoritesService.getFavorites();
  }

  getDisplayName(s: School): string {
    return this.language === 'zh' ? s.chineseName : s.englishName;
  }

  getFavTitle(): string {
    return this.language === 'zh' ? '我的最愛學校' : 'My Favorite Schools';
  }

  getNoFavText(): string {
    return this.language === 'zh' ? '尚未添加最愛學校' : 'No favorites added yet.';
  }
}