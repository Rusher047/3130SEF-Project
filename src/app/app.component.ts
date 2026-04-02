import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Loader', url: '/loader', icon: 'rocket' },
    { title: 'Main Menu', url: '/main', icon: 'home' },
    { title: 'Login', url: '/login', icon: 'log-in' },
  ];
  public labels = [];
  constructor() {}
}
