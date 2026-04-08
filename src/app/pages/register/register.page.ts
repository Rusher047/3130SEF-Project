import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService, AppLanguage } from '../../services/language.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  username = '';
  email = '';
  password = '';
  
  language: AppLanguage = 'en';

  constructor(
    private authService: AuthService,
    private langService: LanguageService,
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false); // Disable side menu on register page
  }

  ngOnInit() {
    this.language = this.langService.currentLanguage;
  }

  async onRegister() {
    if (!this.username || !this.password || !this.email) {
      const msg = this.language === 'zh' ? '請填寫所有欄位' : 'Please fill in all fields';
      alert(msg);
      return;
    }

    try {
      await this.authService.register({
        username: this.username,
        email: this.email,
        password: this.password
      });

      const successMsg = this.language === 'zh' ? '註冊成功！請登入。' : 'Registration Successful! Please Login.';
      alert(successMsg);

      this.router.navigate(['/login']);
    } catch (error: any) {
      alert(error.message || error);
    }
  }

  getRegisterTitle() { return this.language === 'zh' ? '建立新帳戶' : 'Create New Account'; }
  getUserLabel() { return this.language === 'zh' ? '用戶名' : 'Username'; }
  getEmailLabel() { return this.language === 'zh' ? '電郵地址' : 'Email Address'; }
  getPassLabel() { return this.language === 'zh' ? '密碼' : 'Password'; }
  getBackToLogin() { return this.language === 'zh' ? '返回登入' : 'Back to Login'; }
}