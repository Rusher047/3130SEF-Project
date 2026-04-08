import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { LanguageService, AppLanguage } from '../../services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  language: AppLanguage = 'en';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private langService: LanguageService,
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false); // Disable side menu on login page
  }
  
  ngOnInit() {
    this.language = this.langService.currentLanguage;
  }

  async onLogin() {
    if (!this.username || !this.password) {
      const msg = this.language === 'zh' ? '請輸入用戶名和密碼' : 'Please enter username and password';
      alert(msg);
      return;
    }

    const success = await this.authService.login(this.username, this.password);
    
    if (success) {
      this.navCtrl.navigateRoot('/main');
    } else {
      const errorMsg = this.language === 'zh' ? '用戶名或密碼錯誤' : 'Invalid username or password';
      alert(errorMsg);
    }
  }

  // --- HTML Getters Fixed ---
  getLoginTitle(): string {
    return this.language === 'zh' ? '登入' : 'Login';
  }

  getUserLabel(): string {
    return this.language === 'zh' ? '用戶名' : 'Username';
  }

  getPassLabel(): string {
    return this.language === 'zh' ? '密碼' : 'Password';
  }

  goToRegister() {
    this.router.navigate(['/register']);
}
}