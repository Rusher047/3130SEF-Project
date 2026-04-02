import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../services/school'; // Make sure this path is correct

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage implements OnInit {

  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
  }

  // 3. Define the addFav function that the HTML is looking for
  addFav() {
    console.log('Added to favorites!');
    // In the future, you will pass the "school" object here
    // this.schoolService.addToFavorites(someSchool);
  }

}