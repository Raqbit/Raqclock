import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { TimeService } from './time.service';
import { Injectable } from '@angular/core';

/**
 * Alarm
 * @param hours - Hour part of the timestamp
 * @param minutes - Minute part of the timestamp
 * @param active - Is the current alarm active or not
 */
export interface Alarm {
    hours: number;
    minutes: number;
    active: boolean;
}

@Injectable()
export class AlarmService {

    public alarmUpdate: Subject<Alarm>;
    public currentAlarm: Alarm;
    private alarmSound: HTMLAudioElement;

    /**
     *
     * @param _router - Angular Router
     * @param _timeService -
     */
    constructor(private _router: Router, private _timeService: TimeService) {
        this.alarmUpdate = new Subject();
        this.currentAlarm = { hours: 9, minutes: 15, active: true }; // TODO: READ FROM STORAGE

        this._timeService.timeUpdate.subscribe((newTime) => {
            const date = new Date(newTime);
            if (this.currentAlarm.active &&
                this.currentAlarm.hours === date.getHours() &&
                this.currentAlarm.minutes === date.getMinutes()) {

                this.currentAlarm.active = false;
                this._router.navigate(['alarm']);
            }
        });
    }

    /**
     * Update current alarm
     * @param newAlarm - New alarm to be set
     */
    updateAlarm(newAlarm: Alarm) {
        this.currentAlarm = newAlarm;
        this.alarmUpdate.next(newAlarm);
    }
}
