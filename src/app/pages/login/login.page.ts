import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  language: string = 'en';

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.language = this.languageService.currentLanguage;
  }

  onLogin() {
    if (this.username.trim().length > 0 && this.password.trim().length > 0) {
      // 1. Log the user in
      this.authService.login(this.username);
      
      // 2. Redirect to the Main Page
      this.router.navigate(['/main']);
    } else {
      alert(this.language === 'zh' ? '請輸入用戶名和密碼' : 'Please enter username and password');
    }
  }

  // Dual-language getters
  getLoginTitle() { return this.language === 'zh' ? '登入' : 'Login'; }
  getUserLabel() { return this.language === 'zh' ? '用戶名' : 'Username'; }
  getPassLabel() { return this.language === 'zh' ? '密碼' : 'Password'; }
}