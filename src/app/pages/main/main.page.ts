import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false,
})
export class MainPage implements OnInit {

  stats = [
    { label: 'Schools Listed', value: '1,200+', icon: 'school', color: 'primary' },
    { label: 'Locations Covered', value: '18', icon: 'map', color: 'secondary' },
    { label: 'Parent Reviews', value: '5,000+', icon: 'star', color: 'warning' }
  ];

  districts = [
    { name: 'Kowloon City',  image: 'assets/districts/kowloon.jpg', icon: 'business' },
    { name: 'Yau Tsim Mong', icon: 'trail-sign' },
    { name: 'Sham Shui Po', icon: 'leaf' },
    { name: 'Wan Chai', icon: 'briefcase' },
    { name: 'Sha Tin', icon: 'water' },
    { name: 'Sai Kung', icon: 'boat' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  browseDistrict(districtName: string) { this.router.navigate(['/search'], { queryParams: { district: districtName } }); }

  goToSearch() {
    this.router.navigate(['/search']);
  }
}
