import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface UserProfile {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: UserProfile | null = null;

  constructor() {
    this.checkSavedLogin();
  }

  async login(username: string) {
    this.currentUser = {
      username: username,
      email: `${username.toLowerCase()}@edu.hk`
    };
    // Save user to storage
    await Preferences.set({
      key: 'user_session',
      value: JSON.stringify(this.currentUser)
    });
  }

  async logout() {
    this.currentUser = null;
    await Preferences.remove({ key: 'user_session' });
  }

  async checkSavedLogin() {
    const { value } = await Preferences.get({ key: 'user_session' });
    if (value) {
      this.currentUser = JSON.parse(value);
    }
  }

  getUser() { return this.currentUser; }
}