import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../services/school'; // Make sure this path is correct

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false // Keep this for your project style
})
export class ProfilePage implements OnInit {
  
  // 1. Define the favorites array here so the HTML can see it
  favorites: any[] = [];

  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
    // 2. Get the actual favorites from the service when the page loads
    this.favorites = this.schoolService.getFavorites();
  }
}