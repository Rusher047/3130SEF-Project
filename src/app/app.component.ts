import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'School List', url: '/school-list', icon: 'school' },
    { title: 'Favorites', url: '/favorites', icon: 'heart' },
    { title: 'Setting', url: '/settings', icon: 'settings' },
    { title: 'About', url: '/about', icon: 'information-circle' },
  ];
  public labels = [];
  constructor() {}
}
