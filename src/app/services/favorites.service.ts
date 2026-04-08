import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { School } from '../models/school.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoriteSchools: School[] = [];

  constructor() {
    this.loadFavorites();
  }

  // Load from phone memory on start
  async loadFavorites() {
    const { value } = await Preferences.get({ key: 'user_favorites' });
    if (value) {
      this.favoriteSchools = JSON.parse(value);
    }
  }

  // Save to phone memory
  async saveToStorage() {
    await Preferences.set({
      key: 'user_favorites',
      value: JSON.stringify(this.favoriteSchools)
    });
  }

  getFavorites(): School[] {
    return this.favoriteSchools;
  }

  toggleFavorite(school: School): boolean {
    const index = this.favoriteSchools.findIndex(s => s.id === school.id);
    let added = false;

    if (index > -1) {
      this.favoriteSchools.splice(index, 1); // Remove
      added = false;
    } else {
      this.favoriteSchools.push(school); // Add
      added = true;
    }

    this.saveToStorage();
    return added;
  }

  isFavorite(schoolId: string): boolean {
    return this.favoriteSchools.some(s => s.id === schoolId);
  }
}