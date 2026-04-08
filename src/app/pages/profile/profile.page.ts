import { Component, OnInit } from '@angular/core';
import { AuthService, UserProfile } from '../../services/auth.service';
import { School, SchoolService } from '../../services/school.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user: UserProfile | null = null;
  favorites: any[] = [];
  language: string = 'en';

  constructor(
    private authService: AuthService,
    private schoolService: SchoolService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.language = this.languageService.currentLanguage;
    // Get user info from Auth service
    this.user = this.authService.getUser();
    // Get favorites from School service
    this.favorites = this.schoolService.getFavorites();
  }

  getFavTitle() { return this.language === 'zh' ? '我的最愛學校' : 'My Favorite Schools'; }
  getNoFavText() { return this.language === 'zh' ? '尚未添加最愛學校' : 'No favorites added yet.'; }
}