import { Component, OnInit } from '@angular/core';

import { AppLanguage, LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  language: AppLanguage = 'en';

  constructor(private readonly languageService: LanguageService) {}

  ngOnInit(): void {
    this.language = this.languageService.currentLanguage;
  }

  onLanguageChange(language: AppLanguage): void {
    this.language = language;
    this.languageService.setLanguage(language);
  }

  getSettingTitle(): string {
    return this.language === 'zh' ? '設定' : 'Settings';
  }

  getLanguageTitle(): string {
    return this.language === 'zh' ? '語言' : ' Language';
  }
}
