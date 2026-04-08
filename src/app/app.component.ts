import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AppLanguage, LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';
import { FavoritesService } from './services/favorites.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {

  public appPages = [
    { titleEn: 'Home', titleZh: '首頁', url: '/main', icon: 'home' },
    { titleEn: 'Search Schools', titleZh: '搜尋學校', url: '/search', icon: 'search' },
    { titleEn: 'MapView', titleZh: '地圖瀏覽', url: '/map', icon: 'map' },
    { titleEn: 'My Profile', titleZh: '個人檔案', url: '/profile', icon: 'person' },
    { titleEn: 'Favorites', titleZh: '我的最愛', url: '/favorites', icon: 'heart' },
    { titleEn: 'Settings', titleZh: '設定', url: '/settings', icon: 'settings' },
    { titleEn: 'About', titleZh: '關於我們', url: '/about', icon: 'information-circle' },
  ];
  
  public labels = [];
  
  language: AppLanguage = 'en';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private alertController: AlertController, 
    private navCtrl: NavController,
    private readonly languageService: LanguageService ,
    private readonly authService: AuthService,
    private menuCtrl: MenuController,
    private readonly favoritesService: FavoritesService
  ) {}

  async ngOnInit() {
   const user = await this.authService.checkSavedLogin();
  if (user) {
    this.menuCtrl.enable(true); // ENABLE it if user is logged in
    this.navCtrl.navigateRoot('/main');
  } else {
    this.menuCtrl.enable(false); // DISABLE it if not logged in
    this.navCtrl.navigateRoot('/login');
  }
  
    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => (this.language = language));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getSubtitle(): string {
    return this.language === 'zh' ? '搜尋學校的平台' : 'School finding platform';
  }

  getMenuTitle(p: any): string {
    return this.language === 'zh' ? p.titleZh : p.titleEn;
  }

  getLogoutLabel(): string {
    return this.language === 'zh' ? '登出' : 'Logout';
  }


  
  async logout() {

    const headerText = this.language === 'zh' ? '登出' : 'Logout';
    const messageText = this.language === 'zh' ? '您確定要登出嗎？' : 'Are you sure you want to log out?';
    const cancelText = this.language === 'zh' ? '取消' : 'Cancel';
    const confirmText = this.language === 'zh' ? '登出' : 'Logout';

    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: cancelText,
          role: 'cancel'
        },
        {
          text: confirmText,
          cssClass: 'alert-danger',
          handler: () => {
            this.authService.logout();
            this.favoritesService.clearFavorites(); // Clear favorites on logout for security
            this.menuCtrl.enable(false); // Close the menu if it's open
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }
}