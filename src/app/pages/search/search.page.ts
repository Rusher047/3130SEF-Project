import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../services/school.service'; 

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false 
})
export class SearchPage implements OnInit {
  allSchools: any[] = [];      
  filteredSchools: any[] = []; 

  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
    this.schoolService.getSchools().subscribe((data: any) => {
      this.allSchools = data;
      this.filteredSchools = data;
    });
  }

  handleSearch(event: any) {
  const query = event.detail.value.toLowerCase();
  this.filteredSchools = this.allSchools.filter((school) => {
    // Note the new camelCase names from the Master Service
    return school.nameEn.toLowerCase().includes(query) || 
           school.district.toLowerCase().includes(query);
  });
}

addFavorite(school: any) {
  this.schoolService.addToFavorites(school);
}
}