import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

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

  constructor() {}

  /**
   * 1. Check if a user is already logged in (Auto-login)
   * This matches the call in your AppComponent.ngOnInit
   */
  async checkSavedLogin() {
    const { value } = await Preferences.get({ key: 'user_session' });
    if (value) {
      this.currentUser = JSON.parse(value);
    }
    return this.currentUser;
  }

  /**
   * 2. Register a new account into the "Local Database"
   */
  async register(userData: UserProfile) {
    const { value } = await Preferences.get({ key: 'all_users' });
    let users = value ? JSON.parse(value) : [];
    
    // Check if username already exists
    if (users.find((u: any) => u.username === userData.username)) {
      throw new Error('User already exists');
    }

    users.push(userData);
    await Preferences.set({
      key: 'all_users',
      value: JSON.stringify(users)
    });
  }

  /**
   * 3. Verify credentials against the "Local Database"
   */
  async login(username: string, password: string): Promise<boolean> {
    const { value } = await Preferences.get({ key: 'all_users' });
    const users = value ? JSON.parse(value) : [];
    
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      this.currentUser = user;
      // Save the session so checkSavedLogin() finds it next time
      await Preferences.set({
        key: 'user_session',
        value: JSON.stringify(user)
      });
      return true;
    }
    return false;
  }

  /**
   * 4. Clear the session on logout
   */
  async logout() {
    this.currentUser = null;
    await Preferences.remove({ key: 'user_session' });
  }

  /**
   * 5. Get current user data
   */
  getUser() {
    return this.currentUser;
  }
}