import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'en' | 'zh';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'app_language';
  private readonly languageSubject = new BehaviorSubject<AppLanguage>(this.readInitialLanguage());

  readonly language$ = this.languageSubject.asObservable();

  get currentLanguage(): AppLanguage {
    return this.languageSubject.value;
  }

  setLanguage(language: AppLanguage): void {
    this.languageSubject.next(language);
    localStorage.setItem(this.storageKey, language);
  }

  private readInitialLanguage(): AppLanguage {
    const stored = localStorage.getItem(this.storageKey);
    return stored === 'zh' ? 'zh' : 'en';
  }
}
