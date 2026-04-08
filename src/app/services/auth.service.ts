import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FavoritesService } from './favorites.service';

export interface UserProfile {
  username: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: UserProfile | null = null;

  constructor(private favService: FavoritesService) {
  }

  
  async checkSavedLogin() {
    const { value } = await Preferences.get({ key: 'user_session' });
    if (value) {
      this.currentUser = JSON.parse(value);
      await this.favService.loadUserFavorites(this.currentUser!.username);
    }
    return this.currentUser;
  }

  
  async register(userData: UserProfile) {
    const { value } = await Preferences.get({ key: 'all_users' });
    let users = value ? JSON.parse(value) : [];
    
    const exists = users.find((u: any) => u.username === userData.username);
    if (exists) {
      throw new Error('Username already exists. Please choose another.');
    }

    users.push(userData);
    await Preferences.set({
      key: 'all_users',
      value: JSON.stringify(users)
    });
  }

  
  async login(username: string, password: string): Promise<boolean> {
    const { value } = await Preferences.get({ key: 'all_users' });
    const users = value ? JSON.parse(value) : [];
    
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      this.currentUser = user;
      await Preferences.set({
        key: 'user_session',
        value: JSON.stringify(user)
      });
      
      await this.favService.loadUserFavorites(username);
      
      return true;
    }
    return false;
  }

  
  async logout() {
    this.currentUser = null;
    await Preferences.remove({ key: 'user_session' });
    this.favService.clearLocalData();
  }

  
  getUser() {
    return this.currentUser;
  }
}