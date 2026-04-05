import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../services/school.service'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  
  favorites: any[] = [];

  constructor(private schoolService: SchoolService) { }

  ngOnInit() {

    // this.favorites = this.schoolService.getFavorites();
  }
}