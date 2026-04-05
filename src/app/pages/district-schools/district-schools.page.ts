import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { School, SchoolService } from '../../services/school.service';
import { AppLanguage, LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-district-schools',
  templateUrl: './district-schools.page.html',
  styleUrls: ['./district-schools.page.scss'],
  standalone: false
})
export class DistrictSchoolsPage implements OnInit, OnDestroy {
  districtUrlName: string = ''; 
  schools: School[] = [];
  isLoading = true;

  language: AppLanguage = 'en';
  private readonly destroy$ = new Subject<void>();


  descriptions: any = {
    'Kowloon City': {
      zh: '以傳統名校和高學術標準聞名的著名教育樞紐。',
      en: 'A prestigious hub known for elite traditional schools and high academic standards.'
    },
    'Yau Tsim Mong': {
      zh: '位於九龍核心地帶，擁有多元化的學校選擇。',
      en: 'Located in the heart of Kowloon, offering a diverse range of schooling options.'
    },
    'Sham Shui Po': {
      zh: '一個充滿活力的社區，擁有許多歷史悠久和新興的學校。',
      en: 'A vibrant community with a mix of historic and emerging schools.'
    },
    'Wan Chai': {
      zh: '香港核心地帶，擁有許多歷史悠久的學校和頂尖中學。',
      en: 'Home to many historic schools and top-tier secondary institutions in the heart of HK.'
    },
    'Sha Tin': {
      zh: '熱門的住宅區，提供多樣化的高質素資助及私立學校。',
      en: 'A popular residential district with a wide variety of high-quality aided and private schools.'
    },
    'Central': {
      zh: '融合了國際化教育與全港部分最古老的著名學府。',
      en: 'Features a mix of international excellence and some of the oldest schools in the territory.'
    },
    'Tuen Mun': {
      zh: '以廣闊的校園環境和日益增加的現代化教育設施而聞名。',
      en: 'Known for spacious campuses and a rapidly growing number of modern educational facilities.'
    },
    'Sai Kung': {
      zh: '環境優美，擁有多間著名的國際學校和優質本地學校。',
      en: 'A unique district offering beautiful surroundings and several famous international schools.'
    }
  };


  districtNameMap: any = {
    'Kowloon City': '九龍城',
    'Yau Tsim Mong': '油尖旺',
    'Sham Shui Po': '深水埗',
    'Wan Chai': '灣仔',
    'Sha Tin': '沙田',
    'Central': '中環',
    'Tuen Mun': '屯門',
    'Sai Kung': '西貢'
  };

  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private languageService: LanguageService,
    private router: Router
  ) { }

  ngOnInit() {

    this.language = this.languageService.currentLanguage;
    this.languageService.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => (this.language = language));

    this.districtUrlName = this.route.snapshot.paramMap.get('name') || '';
    
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.isLoading = true;
    this.schoolService.getSchools().subscribe({
      next: (allData: School[]) => {
        const target = this.districtUrlName.toUpperCase().trim();
        this.schools = allData.filter(s => 
          s.district && s.district.toUpperCase().trim() === target
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading schools:', err);
        this.isLoading = false;
      }
    });
  }


  getDisplayDistrictName(): string {
    if (this.language === 'zh') {
      return this.districtNameMap[this.districtUrlName] || this.districtUrlName;
    }
    return this.districtUrlName;
  }

  getDisplayDescription(): string {
    const data = this.descriptions[this.districtUrlName];
    if (data) {
      return this.language === 'zh' ? data.zh : data.en;
    }
    return this.language === 'zh' ? '富有活力的教育社區。' : 'A vibrant educational community.';
  }

  getDisplayName(s: School): string {
    return this.language === 'zh' ? s.nameZh : s.nameEn;
  }

  getDisplayAddress(s: School): string {
    return this.language === 'zh' ? s.addressZh : s.addressEn;
  }

  getSchoolsFoundText(): string {
    return this.language === 'zh' ? `找到 ${this.schools.length} 間學校` : `${this.schools.length} Schools Found`;
  }

  getLoadingText(): string {
    return this.language === 'zh' ? '正在載入...' : 'Loading...';
  }

  getSchoolInfoTitle(): string {
    return this.language === 'zh' ? '此區學校列表' : 'Schools in this Area';
  }

  gotoDetail(school: School) {
    this.router.navigate(['/school-detail', school.id]);
  }

  getDistrictTitle(): string {
    return this.language === 'zh' ? `${this.getDisplayDistrictName()}地區精選` : `${this.getDisplayDistrictName()} District Spotlight`;
  } 

  getDisplayLevel(s: School): string {
    return this.language === 'zh' ? s.schoolTypeZh : s.schoolLevel;
  }

}