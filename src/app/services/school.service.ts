import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { School } from '../models/school.model';


@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private favorites: School[] = [];
  private readonly datasetUrl = 'https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.json';
  

  constructor(private readonly http: HttpClient) {
    this.loadFavorites();
  }


  async saveFavorites() {
    await Preferences.set({
      key: 'my_favorites',
      value: JSON.stringify(this.favorites)
    });
  }

  async loadFavorites() {
    const { value } = await Preferences.get({ key: 'my_favorites' });
    if (value) {
        this.favorites = JSON.parse(value);
      }
    }

     getFavorites() {
    return this.favorites;
  }

  addToFavorites(school: School) {
    if (!this.favorites.find(s => s.id === school.id)) {
      this.favorites.push(school);
      this.saveFavorites(); // 3. Save to memory after adding
    }
  }

  removeFromFavorites(school: School) {
    this.favorites = this.favorites.filter(s => s.id !== school.id);
    this.saveFavorites(); // 4. Save to memory after removing
  }

  getSchools(): Observable<School[]> {
    return this.http.get<unknown>(this.datasetUrl).pipe(
      timeout(15000),
      map((response) => this.extractRawSchools(response)),
      map((items) => items.map((item, index) => this.mapSchool(item, index)))
    );
  }


  private extractRawSchools(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) return response.filter((item) => this.isRecord(item));
    if (this.isRecord(response)) {
      const possibleArrays = [response['schools'], response['data'], response['items'], response['result']];
      for (const value of possibleArrays) {
        if (Array.isArray(value)) return value.filter((item) => this.isRecord(item));
      }
    }
    return [];
  }

  private mapSchool(raw: Record<string, unknown>, index: number): School {
    const schoolNo = this.pickString(raw, ['SCHOOL NO.']) || `school-${index}`;

    const englishCategory = this.pickString(raw, ['ENGLISH CATEGORY']);
    const englishName = this.pickString(raw, ['ENGLISH NAME']);
    const englishAddress = this.pickString(raw, ['ENGLISH ADDRESS']);
    const longitudeEn = this.pickNumber(raw, ['LONGITUDE']);
    const latitudeEn = this.pickNumber(raw, ['LATITUDE']);
    const eastingEn = this.pickNumber(raw, ['EASTING']);
    const northingEn = this.pickNumber(raw, ['NORTHING']);
    const studentsGenderEn = this.pickString(raw, ['STUDENTS GENDER']);
    const sessionEn = this.pickString(raw, ['SESSION']);
    const districtEn = this.pickString(raw, ['DISTRICT']);
    const financeTypeEn = this.pickString(raw, ['FINANCE TYPE']);
    const schoolLevelEn = this.pickString(raw, ['SCHOOL LEVEL']);
    const telephoneEn = this.pickString(raw, ['TELEPHONE']);
    const faxNumberEn = this.pickString(raw, ['FAX NUMBER']);
    const websiteEn = this.pickString(raw, ['WEBSITE']);
    const religionEn = this.pickString(raw, ['RELIGION']);

    const chineseCategory = this.pickString(raw, ['中文類別']);
    const chineseName = this.pickString(raw, ['中文名稱']);
    const chineseAddress = this.pickString(raw, ['中文地址']);
    const longitudeZh = this.pickNumber(raw, ['經度']);
    const latitudeZh = this.pickNumber(raw, ['緯度']);
    const eastingZh = this.pickNumber(raw, ['坐標東']);
    const northingZh = this.pickNumber(raw, ['坐標北']);
    const studentsGenderZh = this.pickString(raw, ['就讀學生性別']);
    const sessionZh = this.pickString(raw, ['學校授課時間']);
    const districtZh = this.pickString(raw, ['分區']);
    const financeTypeZh = this.pickString(raw, ['資助種類']);
    const schoolTypeZh = this.pickString(raw, ['學校類型']);
    const telephoneZh = this.pickString(raw, ['聯絡電話']);
    const faxNumberZh = this.pickString(raw, ['傳真號碼']);
    const websiteZh = this.pickString(raw, ['網頁']);
    const religionZh = this.pickString(raw, ['宗教']);

    return {
      schoolNo,
      englishCategory,
      chineseCategory,
      englishName,
      chineseName,
      englishAddress,
      chineseAddress,
      longitudeEn,
      latitudeEn,
      eastingEn,
      northingEn,
      studentsGenderEn,
      sessionEn,
      districtEn,
      financeTypeEn,
      schoolLevelEn,
      telephoneEn,
      faxNumberEn,
      websiteEn,
      religionEn,
      longitudeZh,
      latitudeZh,
      eastingZh,
      northingZh,
      studentsGenderZh,
      sessionZh,
      districtZh,
      financeTypeZh,
      schoolTypeZh,
      telephoneZh,
      faxNumberZh,
      websiteZh,
      religionZh,

      id: schoolNo,
      nameEn: englishName,
      nameZh: chineseName,
      district: districtEn,
      addressEn: englishAddress,
      addressZh: chineseAddress,
      telephone: telephoneEn,
      fax: faxNumberEn,
      email: this.pickString(raw, ['EMAIL', 'SCH_EMAIL']),
      website: websiteEn,
      schoolLevel: schoolLevelEn,
      schoolType: englishCategory,
      financeType: financeTypeEn,
      gender: studentsGenderEn,
      session: sessionEn,
      religion: religionEn,
      latitude: latitudeEn,
      longitude: longitudeEn,
    };
  }

  private pickString(raw: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value = raw[key];
      if (typeof value === 'string' && value.trim().length > 0) return value.trim();
      if (typeof value === 'number') return String(value);
    }
    return '';
  }

  private pickNumber(raw: Record<string, unknown>, keys: string[]): number | null {
    for (const key of keys) {
      const value = raw[key];
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && value.trim()) return Number(value.trim());
    }
    return null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}

export { School };
