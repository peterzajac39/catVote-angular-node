import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.css']
})

export class VotesComponent implements OnInit {

  constructor(private http: HttpClient) { }

  private firstCat: any;
  private secondCat: any;
  public loading = false;
  private imageCounter = 0;
  private allowedToVote = false;
  private voteCounter = 0;

  ngOnInit() {

    this.loading = true;
    this.allowedToVote = false;

    this.getNewCats().then(response => {

      this.firstCat = response[0][0];
      this.secondCat = response[1][0];
      this.secondCat.votes = 0;
      this.firstCat.votes = 0;
    });
  }

  getNewCats() {

    let promises = [];

    promises.push(this.http.get("https://api.thecatapi.com/v1/images/search?size=small").toPromise());
    promises.push(this.http.get("https://api.thecatapi.com/v1/images/search?size=small").toPromise());

    return Promise.all(promises);
  }

  getPreviousCats() {

    return this.http.get('/api/v1/getRandomCats').toPromise();
  }

  myTypeScriptFunction(cat, item){

    if (!this.allowedToVote) {
      console.log('Dont click now, its loading images.');
      return;
    }

    this.loading = true;
    this.allowedToVote = false;

    const catArray = [];
    const voteObject = {cats: []};

    if (cat.id === this.firstCat.id) {
      this.firstCat.votes++;
    }

    if (cat.id === this.secondCat.id) {
      this.secondCat.votes++;
    }

    catArray.push(this.firstCat);
    catArray.push(this.secondCat);

    voteObject.cats = catArray;

    this.http.post('/api/v1/log', voteObject).toPromise()
      .then(response => {
        console.log('Vote logged.', voteObject);

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
            this.secondCat.votes = 0;
            this.firstCat.votes = 0;
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
