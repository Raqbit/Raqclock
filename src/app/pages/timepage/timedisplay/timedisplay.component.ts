import { Component, OnInit } from '@angular/core';
import {TimeService} from "../../../core/services/time.service";

@Component({
  selector: 'rqc-timedisplay',
  templateUrl: './timedisplay.component.html',
  styleUrls: ['./timedisplay.component.css']
})
export class TimedisplayComponent implements OnInit {

  public currentTime: number;

  constructor(private _time: TimeService) {
    this.currentTime = this._time.currentTime;

    this._time.timeUpdate.subscribe((newTime) => {
      this.currentTime = newTime;
    });
  }

  ngOnInit() {
  }

}
