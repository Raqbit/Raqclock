import { Router } from '@angular/router';
import { Alarm, AlarmService } from './../../shared/alarm.service';
import { TimeService } from './../../shared/time.service';
import { ButtonService, ButtonEvent } from './../../shared/button.service';
import { Component } from '@angular/core';

@Component({
    selector: 'rqc-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {

    public _currentTime: { digits: string, ampm: 'PM' | 'AM' };

    public _currentAlarm: { digits: string, ampm: 'PM' | 'AM', active: boolean };

    constructor(private _router: Router,
        private _timeService: TimeService,
        private _alarmService: AlarmService,
        private _buttonService: ButtonService) {
        this.updateTimeDisplay(this._timeService.currentTime);

        this._timeService.timeUpdate.subscribe((newTime) => {
            this.updateTimeDisplay(newTime);
        });

        this.updateAlarmDisplay(this._alarmService.currentAlarm);

        this._alarmService.alarmUpdate.subscribe((newAlarm) => {
            this.updateAlarmDisplay(newAlarm);
        });

        this._buttonService.buttonSubject.subscribe((buttonPressed: ButtonEvent) => {
            switch (buttonPressed.buttonNum) {
                case 0: this._router.navigate(['menu', 'main']); break;
            }
        });
    }

    updateTimeDisplay(newTime) {
        const date = new Date(newTime);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        this._currentTime = { digits: hours + ':' + minutesStr, ampm: date.getHours() >= 12 ? 'PM' : 'AM' };
    }

    updateAlarmDisplay(newAlarm: Alarm) {
        let hours = newAlarm.hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = newAlarm.minutes < 10 ? '0' + newAlarm.minutes : newAlarm.minutes;
        this._currentAlarm = { digits: hours + ':' + minutesStr, ampm: newAlarm.hours >= 12 ? 'PM' : 'AM', active: newAlarm.active };
    }
}
