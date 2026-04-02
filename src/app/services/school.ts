import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private favorites: any[] = [];

  constructor() { }

  getFavorites() {
    return this.favorites;
  }

  addToFavorites(school: any) {
    this.favorites.push(school);
  }
}