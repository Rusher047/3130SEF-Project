import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface School {
  id: string;
  nameEn: string;
  nameZh: string;
  district: string;
  addressEn: string;
  addressZh: string;
  telephone: string;
  website: string;
  schoolLevel: string;
  latitude: number | null;
  longitude: number | null;
  // Add any other fields you need
}

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly datasetUrl = 'https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.json';
  
  private favorites: School[] = [];

  constructor(private readonly http: HttpClient) {}


  getSchools(): Observable<School[]> {
    return this.http.get<unknown>(this.datasetUrl).pipe(
      map((response) => this.extractRawSchools(response)),
      map((items) => items.map((item, index) => this.mapSchool(item, index)))
    );
  }

  getFavorites() {
    return this.favorites;
  }

  addToFavorites(school: School) {
    if (!this.favorites.find(s => s.id === school.id)) {
      this.favorites.push(school);
    }
  }

  removeFromFavorites(school: School) {
    this.favorites = this.favorites.filter(s => s.id !== school.id);
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
    return {
      id: this.pickString(raw, ['id', 'ID', 'SCH_ID', 'SCHOOL_ID']) || `school-${index}`,
      nameEn: this.pickString(raw, ['ENGLISH NAME', 'NAME_EN', 'SCH_NAMEE']),
      nameZh: this.pickString(raw, ['中文名稱', 'NAME_TC', 'NAME_ZH']),
      district: this.pickString(raw, ['DISTRICT', 'DISTRICT_EN']),
      addressEn: this.pickString(raw, ['ADDRESS_EN', 'ADDR_EN']),
      addressZh: this.pickString(raw, ['ADDRESS_TC', 'ADDR_TC']),
      telephone: this.pickString(raw, ['TEL', 'TELNO']),
      website: this.pickString(raw, ['WEBSITE', 'WEB']),
      schoolLevel: this.pickString(raw, ['SCHOOL_LEVEL', 'LEVEL']),
      latitude: this.pickNumber(raw, ['LATITUDE', 'LAT']),
      longitude: this.pickNumber(raw, ['LONGITUDE', 'LNG']),
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