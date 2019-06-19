import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {LoggerService} from "../logger.service";


@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.css']
})

export class VotesComponent implements OnInit {

  constructor(private http: HttpClient,
              private loggerService: LoggerService) { }

  private firstCat: any;
  private secondCat: any;
  public loading = false;
  private imageCounter = 0;
  private allowedToVote = false;
  private voteCounter = 0;

  ngOnInit() {

    this.loading = true;
    this.allowedToVote = false;

    // first we get 2 new cats
    this.getNewCats().then(response => {

      this.firstCat = response[0][0];
      this.secondCat = response[1][0];
      this.secondCat.votes = [];
      this.firstCat.votes = [];
    });
  }

  // we get 2 new cats from server
  getNewCats() {

    let promises = [];

    promises.push(this.http.get('/api/v1/getNewCat').toPromise());
    promises.push(this.http.get('/api/v1/getNewCat').toPromise());

    return Promise.all(promises);
  }

  getPreviousCats() {

    return this.http.get('/api/v1/getRandomCats').toPromise();
  }

  logCatVote(cat){

    if (!this.allowedToVote) {
      console.log('Dont click now, its loading images.');
      return;
    }

    this.loading = true;
    this.allowedToVote = false;

    const catArray = [];
    const voteObject = {cats: []};

    // from vote we log timestamp of vote
    if (cat.id === this.firstCat.id) {
      this.firstCat.votes.push(Date.now());
    }

    if (cat.id === this.secondCat.id) {
      this.secondCat.votes.push(Date.now());
    }

    catArray.push(this.firstCat);
    catArray.push(this.secondCat);
    voteObject.cats = catArray;

    // log cat vote to server, we log both cats as pair
    this.http.post('/api/v1/log', voteObject).toPromise()
      .then(response => {
        console.log('Vote logged.', voteObject);
        // we publish change via service to other components
        this.loggerService.logVote(voteObject);
        // random chance 50-50 to get old pair or new after first 10 votes
        if (this.voteCounter >= 10 && Math.random() > 0.5) {
          console.log('Get old pair');
          this.getPreviousCats().then(res => {
            this.firstCat = res[0]['cats'][0];
            this.secondCat = res[0]['cats'][1];
            this.voteCounter++;
          });
        } else {
          console.log('Get new pair');
          this.getNewCats().then(res => {
            this.firstCat = res[0][0];
            this.secondCat = res[1][0];
            this.secondCat.votes = [];
            this.firstCat.votes = [];
            this.voteCounter++;
          });
        }
      });
  }

  waitForLoad(){

    this.imageCounter++;

    if (this.imageCounter === 2) {
      this.loading = false;
      this.allowedToVote = true;
      this.imageCounter = 0;
    }
  }

}
