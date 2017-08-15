import { ButtonService } from './shared/button.service';
import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'rqc-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
})
export class AppComponent {

    private pressed = {};

    constructor(private buttonService: ButtonService) { }

    // Listening for keyboard input, mainly for development
    @HostListener('window:keydown', ['$event'])
    keyDown(event: KeyboardEvent) {
        if (this.pressed[event.which]) { return; }
        this.pressed[event.which] = event.timeStamp;
    }

    @HostListener('window:keyup', ['$event'])
    keyUp(event: KeyboardEvent) {
        if (!this.pressed[event.which]) { return; }

        const duration = (event.timeStamp - this.pressed[event.which]) / 1000;

        let buttonNum = -1;

        switch (event.which) {
            case 81:
                buttonNum = 0;
                break;
            case 87:
                buttonNum = 1;
                break;
            case 69:
                buttonNum = 2;
                break;
            case 82: {
                buttonNum = 3;
                break;
            }
        }

        if (buttonNum >= 0) {
            this.buttonService.buttonSubject.next({ buttonNum: buttonNum, duration: duration });
        }

        this.pressed[event.which] = 0;
    }
}
