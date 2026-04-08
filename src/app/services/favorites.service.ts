import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { School } from '../models/school.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoriteSchools: School[] = [];
  private currentUsername: string = '';

  constructor() {
    
  }

  
  async loadUserFavorites(username: string) {
    this.currentUsername = username;
    const { value } = await Preferences.get({ key: `favorites_${username}` });
    
    if (value) {
      this.favoriteSchools = JSON.parse(value);
    } else {
      this.favoriteSchools = [];
    }
    console.log(`Favorites Service: Loaded ${this.favoriteSchools.length} schools for user: ${username}`);
  }

  
  async saveToStorage() {
    if (!this.currentUsername) {
      console.error('Favorites Service: Cannot save, no user logged in.');
      return;
    }
    
    await Preferences.set({
      key: `favorites_${this.currentUsername}`,
      value: JSON.stringify(this.favoriteSchools)
    });
  }

  
  getFavorites(): School[] {
    return this.favoriteSchools;
  }

  
  toggleFavorite(school: School): boolean {
    const index = this.favoriteSchools.findIndex(s => s.id === school.id);
    let isNowFav = false;

    if (index > -1) {
      this.favoriteSchools.splice(index, 1);
      isNowFav = false;
    } else {
      this.favoriteSchools.push(school);
      isNowFav = true;
    }

    this.saveToStorage();
    return isNowFav;
  }

  
  isFavorite(schoolId: string): boolean {
    return this.favoriteSchools.some(s => s.id === schoolId);
  }

  
  clearLocalData() {
    this.favoriteSchools = [];
    this.currentUsername = '';
    console.log('Favorites Service: Local memory cleared for logout.');
  }
}