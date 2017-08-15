import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class TimeService {
    public currentTime: number;

    public timeUpdate: Subject<number>;

    constructor() {
        this.currentTime = new Date().getTime();

        this.timeUpdate = new Subject();

        setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    private updateClock() {
        this.currentTime = new Date().getTime();
        this.timeUpdate.next(this.currentTime);
    }

}
