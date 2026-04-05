import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../services/school.service'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false 
})
export class SearchPage implements OnInit {
  allSchools: any[] = [];      
  filteredSchools: any[] = []; 

  constructor(private schoolService: SchoolService, private route: ActivatedRoute) { }

  ngOnInit() {


    this.schoolService.getSchools().subscribe((data: any) => {
      this.allSchools = data;
      this.filteredSchools = data;
    });

    this.route.queryParams.subscribe((params: any) => {
      const district = params.district;
      if (district) {
        this.filteredSchools = this.allSchools.filter((school) => school.district === district);
      }
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