import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {LoggerService} from "../logger.service";
import {Lightbox} from "ngx-lightbox";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy {

  private catPairs: any;
  private paginatedPairs = [];
  subscription: Subscription;
  paginationIndex = 5;
  paginationStep = 5;

  constructor(private http: HttpClient,
              private loggerService: LoggerService,
              private lightbox: Lightbox) {

    // we watch for changes when we get new vote from vote component
    this.subscription = loggerService.catVoted$
      .subscribe(cat => {
      console.log('new cat ', cat);

      this.getAllCatPairs()
        .then(docs => {
          this.catPairs = docs;
          if (this.catPairs.length < this.paginationStep)
            this.paginatedPairs = this.catPairs;
        })
        .catch(err => console.log(err));

    });
  }

  ngOnInit() {

    this.getAllCatPairs()
      .then(docs => {
        this.catPairs = docs;
        this.paginatedPairs = this.catPairs.slice(0, this.paginationIndex);
      })
      .catch(err => console.log(err));


  }

  getAllCatPairs() {

    return this.http.get('/api/v1/getAllCats').toPromise();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  // bring image to front, "gallery"
  open(cat: any) {
    this.lightbox.open([{src: cat.url, thumb: cat.url, caption: cat.name}],  0, {centerVertically: true});
  }

  // we handle "pagination"
  showMore() {
    if ((this.paginationIndex + this.paginationStep) > this.catPairs.length)
      this.paginationIndex = this.catPairs.length;
    else
      this.paginationIndex += this.paginationStep;

    this.paginatedPairs = this.catPairs.slice(0, this.paginationIndex);
  }
}
