import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { School } from '../models/school.model';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly datasetUrl =
    'https://www.edb.gov.hk/attachment/en/student-parents/sch-info/sch-search/sch-location-info/SCH_LOC_EDB.json';

  constructor(private readonly http: HttpClient) {}

  getSchools(): Observable<School[]> {
    return this.http.get<unknown>(this.datasetUrl).pipe(
      map((response) => this.extractRawSchools(response)),
      map((items) => items.map((item, index) => this.mapSchool(item, index)))
    );
  }

  private extractRawSchools(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) {
      return response.filter((item) => this.isRecord(item));
    }

    if (this.isRecord(response)) {
      const possibleArrays = [
        response['schools'],
        response['data'],
        response['items'],
        response['result'],
      ];

      for (const value of possibleArrays) {
        if (Array.isArray(value)) {
          return value.filter((item) => this.isRecord(item));
        }
      }
    }

    return [];
  }

  private mapSchool(raw: Record<string, unknown>, index: number): School {
    const id = this.pickString(raw, ['id', 'ID', 'SCH_ID', 'SCHOOL_ID']) || `school-${index}`;

    return {
      id,
      nameEn: this.pickString(raw, ['ENGLISH NAME', 'NAME_EN', 'SCH_NAMEE', 'SCH_NAME_ENG', 'SCHNAME_E', 'NAMEE']),
      nameZh: this.pickString(raw, ['中文名稱', 'NAME_TC', 'NAME_ZH', 'SCH_NAMET', 'SCH_NAME_CHI', 'SCHNAME_C', 'NAMET']),
      district: this.pickString(raw, ['DISTRICT', 'DISTRICT_EN', 'DISTRICT_TC', 'DISTRICT_NAME']),
      addressEn: this.pickString(raw, ['ADDRESS_EN', 'ADDR_EN', 'SCH_ADDR_E', 'ADDRESSE']),
      addressZh: this.pickString(raw, ['ADDRESS_TC', 'ADDRESS_ZH', 'ADDR_TC', 'SCH_ADDR_C', 'ADDRESST']),
      telephone: this.pickString(raw, ['TEL', 'TELNO', 'PHONE', 'SCH_TEL']),
      fax: this.pickString(raw, ['FAX', 'FAXNO', 'SCH_FAX']),
      email: this.pickString(raw, ['EMAIL', 'SCH_EMAIL']),
      website: this.pickString(raw, ['WEBSITE', 'WEB', 'HOMEPAGE', 'SCH_WEB']),
      schoolLevel: this.pickString(raw, ['SCHOOL_LEVEL', 'LEVEL', 'SCH_LEVEL']),
      schoolType: this.pickString(raw, ['SCHOOL_TYPE', 'TYPE', 'SCH_TYPE']),
      financeType: this.pickString(raw, ['FINANCE_TYPE', 'FIN_TYPE', 'SCH_FIN_TYPE']),
      gender: this.pickString(raw, ['GENDER', 'SEX', 'STUDENT_GENDER']),
      session: this.pickString(raw, ['SESSION', 'SCH_SESSION']),
      religion: this.pickString(raw, ['RELIGION', 'SCH_RELIGION']),
      latitude: this.pickNumber(raw, ['LATITUDE', 'LAT', 'Y']),
      longitude: this.pickNumber(raw, ['LONGITUDE', 'LNG', 'LONG', 'X']),
    };
  }

  private pickString(raw: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value = raw[key];
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
          return trimmed;
        }
      }
      if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
      }
    }

    return '';
  }

  private pickNumber(raw: Record<string, unknown>, keys: string[]): number | null {
    for (const key of keys) {
      const value = raw[key];

      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) {
          continue;
        }

        const parsed = Number(trimmed);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
