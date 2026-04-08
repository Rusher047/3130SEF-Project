import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService, AppLanguage } from '../../services/language.service';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.language = this.langService.currentLanguage;
  }

  async onRegister() {
    if (!this.username || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await this.authService.register({
        username: this.username,
        email: this.email,
        password: this.password
      });
      
      const msg = this.language === 'zh' ? '註冊成功！請登入。' : 'Registration Successful! Please Login.';
      alert(msg);
      this.router.navigate(['/login']);
    } catch (error) {
      alert(error);
    }
  }

  getRegisterTitle() {
    return this.language === 'zh' ? '建立帳戶' : 'Create Account';
  }
}