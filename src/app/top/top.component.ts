import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger.service";
import {Subscription} from "rxjs";
import {Lightbox} from "ngx-lightbox";

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

export class TopComponent implements OnInit, OnDestroy {

  private allCats = [];
  private currentType = SortType.Timestamp;
  private currentOrder = SortOrder.Desc;
  private subscription: Subscription;

  constructor(private http: HttpClient, private loggerService: LoggerService, private lightbox: Lightbox) {

    // we watch for changes when we get new vote from vote component
    this.subscription = loggerService.catVoted$
      .subscribe(cat => {
        console.log('new cat', cat);

        this.getAllCatPairs()
          .then(docs => {
            this.allCats = [];
            let allDocs: any;
            allDocs = docs;
            allDocs.forEach(doc => {
              this.allCats.push(doc.cats[0]);
              this.allCats.push(doc.cats[1]);
            });
            this.sortCats();
          })
          .catch(err => console.log(err));
      });
  }

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

  // we sort array of cats based on toggle buttons
  sortCats() {

    this.allCats.sort((a, b) => {
      if (this.currentType === SortType.Vote && this.currentOrder === SortOrder.Asc){
        return a.votes.length - b.votes.length;
      }
      if (this.currentType === SortType.Vote && this.currentOrder === SortOrder.Desc){
        return b.votes.length - a.votes.length;
      }
      if (this.currentType === SortType.Timestamp && this.currentOrder === SortOrder.Asc){
        return Math.max(...a.votes) - Math.max(...b.votes);
      }
      if (this.currentType === SortType.Timestamp && this.currentOrder === SortOrder.Desc){
        return Math.max(...b.votes) - Math.max(...a.votes);
      }
    });
  }

  getAllCatPairs() {

    return this.http.get('/api/v1/getAllCats').toPromise();
  }

  // handle toggle button sorting
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

  getLastVoteTime(cat: any) {

    if (cat.votes.length == 0)
      return 0;
    else
      return Math.max(...cat.votes);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  // bring image to front, "gallery"
  open(cat: any) {
    this.lightbox.open([{src: cat.url, thumb: cat.url, caption: cat.name}], 0, {centerVertically: true});
  }
}
