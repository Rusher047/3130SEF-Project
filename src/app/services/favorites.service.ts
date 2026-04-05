import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly storageKey = 'favorite-school-ids';

  getFavoriteIds(): string[] {
    return this.readFavoriteIds();
  }

  isFavorite(schoolId: string): boolean {
    if (!schoolId) {
      return false;
    }

    return this.readFavoriteIds().includes(schoolId);
  }

  toggleFavorite(schoolId: string): boolean {
    if (!schoolId) {
      return false;
    }

    const favoriteIds = this.readFavoriteIds();
    const existingIndex = favoriteIds.indexOf(schoolId);

    if (existingIndex >= 0) {
      favoriteIds.splice(existingIndex, 1);
      this.writeFavoriteIds(favoriteIds);
      return false;
    }

    favoriteIds.push(schoolId);
    this.writeFavoriteIds(favoriteIds);
    return true;
  }

  private readFavoriteIds(): string[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item) => typeof item === 'string' && item.trim().length > 0);
    } catch {
      return [];
    }
  }

  private writeFavoriteIds(ids: string[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    } catch {
      // Ignore storage write failures to keep UI stable.
    }
  }
}
