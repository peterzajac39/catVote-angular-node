import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoggerService {

  // Observable string sources
  private catVotedSubject = new Subject<string>();

  // Observable string streams
  catVoted$ = this.catVotedSubject.asObservable();

  // Service message commands
  logVote(cat: any) {
    this.catVotedSubject.next(cat);
  }
}
