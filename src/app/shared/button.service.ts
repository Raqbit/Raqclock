import { NgxElectronService } from './../ngx-electron/ngx-electron.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface ButtonEvent {
    buttonNum: number;
    duration: number;
}

@Injectable()
export class ButtonService {

    public buttonSubject: Subject<ButtonEvent>;

    constructor(private _elctronService: NgxElectronService) {
        this.buttonSubject = new Subject();
        this._elctronService.listener$.subscribe((data) => {
            // Fix weird null data coming through on startup
            if (data) {
                console.log('electron: ' + data);
            }
        });
    }
}
