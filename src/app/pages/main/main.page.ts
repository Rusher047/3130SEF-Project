import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppLanguage, LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false,
})
export class MainPage implements OnInit, OnDestroy {
  language: AppLanguage = 'en';
  private readonly destroy$ = new Subject<void>();


  stats = [
    { labelEn: 'Schools Listed', labelZh: '學校總數', value: '3,500+', icon: 'school', color: 'primary' },
    { labelEn: 'Locations Covered', labelZh: '涵蓋地區', value: '18', icon: 'map', color: 'secondary' },
    { labelEn: 'Parent Reviews', labelZh: '家長評論', value: '5,000+', icon: 'star', color: 'warning' }
  ];


  districts = [
    { nameEn: 'Kowloon City', nameZh: '九龍城', image: 'assets/districts/kowloon.jpg', icon: 'business' },
    { nameEn: 'Yau Tsim Mong', nameZh: '油尖旺', image: 'assets/districts/yau_tsim_mong.jpg', icon: 'trail-sign' },
    { nameEn: 'Sham Shui Po', nameZh: '深水埗', image: 'assets/districts/sham_shui_po.jpg', icon: 'leaf' },
    { nameEn: 'Wan Chai', nameZh: '灣仔', image: 'assets/districts/wan_chai.jpg', icon: 'briefcase' },
    { nameEn: 'Sha Tin', nameZh: '沙田', image: 'assets/districts/sha_tin.jpg', icon: 'water' },
    { nameEn: 'Sai Kung', nameZh: '西貢', image: 'assets/districts/sai_kung.jpg', icon: 'boat' }
  ];

  constructor(
    private router: Router,
    private readonly languageService: LanguageService
  ) { }

  ngOnInit() {

    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => (this.language = language));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  
  getTitle(): string {
    return this.language === 'zh' ? '學校搜尋平台' : 'School Finder';
  }

  getHeroTitle(): string {
    return this.language === 'zh' ? '為您的孩子尋找理想學校' : 'Find the Perfect School for Your Child';
  }

  getHeroSubtitle(): string {
    return this.language === 'zh' ? '全港最全面的學校資料庫。' : 'The most comprehensive school database in Hong Kong.';
  }

  getStartSearchText(): string {
    return this.language === 'zh' ? '立即開始搜尋' : 'Start Searching Now';
  }

  getPopularDistrictsTitle(): string {
    return this.language === 'zh' ? '熱門地區' : 'Popular Districts';
  }

  getExploreSubtitle(): string {
    return this.language === 'zh' ? '按地點探索學校' : 'Explore schools by location';
  }

  getDistrictDisplayName(district: any): string {
    return this.language === 'zh' ? district.nameZh : district.nameEn;
  }

  getStatLabel(stat: any): string {
    return this.language === 'zh' ? stat.labelZh : stat.labelEn;
  }

  // --- NAVIGATION ---

  browseDistrict(district: any) {

    this.router.navigate(['/district-schools', district.nameEn]);
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }
}