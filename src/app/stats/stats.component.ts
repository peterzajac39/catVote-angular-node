import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  private catPairs: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.getAllCatPairs()
      .then(docs => this.catPairs = docs)
      .catch(err => console.log(err));


  }

  getAllCatPairs() {

    return this.http.get('/api/v1/getAllCats').toPromise();
  }
}
