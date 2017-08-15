import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rqc-main',
    templateUrl: './alarm.component.html',
    styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {

    constructor(private _router: Router) { }

    ngOnInit() {
    }

    stopAlarm() {
        this._router.navigate(['']);
    }

}
