import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

export enum SortType {
  Vote,
  Timestamp
}
export enum SortOrder {
  Asc,
  Desc
}

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})

export class TopComponent implements OnInit {

  private allCats = [];
  private currentType = SortType.Vote;
  private currentOrder = SortOrder.Desc;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.getAllCatPairs()
      .then(docs => {
        let allDocs: any;
        allDocs = docs;
        allDocs.forEach(doc => {
          this.allCats.push(doc.cats[0]);
          this.allCats.push(doc.cats[1]);
        });
        console.log('All cats', this.allCats);
        this.sortCats();
        console.log('cats sorted', this.allCats);
      })
      .catch(err => console.log(err));

  }

  sortCats() {

    this.allCats.sort((a, b) => {
      if (this.currentType === SortType.Vote && this.currentOrder === SortOrder.Asc){
        return a.votes - b.votes;
      }
      if (this.currentType === SortType.Vote && this.currentOrder === SortOrder.Desc){
        return b.votes - a.votes;
      }
    });
  }

  getAllCatPairs() {

    return this.http.get('/api/v1/getAllCats').toPromise();
  }

  onValChange(value: any) {
    switch(value) {
      case 'vote': {
        this.currentType = SortType.Vote;
        this.sortCats()
        break;
      }
      case 'timestamp': {
        this.currentType = SortType.Timestamp;
        break;
      }
      case 'asc': {
        this.currentOrder = SortOrder.Asc;
        break;
      }
      case 'desc': {
        this.currentOrder = SortOrder.Desc;
        break;
      }
    }
    this.sortCats();
  }
}
