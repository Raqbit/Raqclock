import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import * as moment from "moment";

@Injectable()
export class TimeService {

  public currentTime: number;

  public timeUpdate: Subject<number>;

  constructor() {
    this.currentTime = moment().unix();

    this.timeUpdate = new Subject();

    setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  private updateClock() {
    this.currentTime = moment().unix();
    this.timeUpdate.next(this.currentTime);
  }
}
