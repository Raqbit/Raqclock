import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";

export interface ButtonEvent {
  buttonNum: number;
  duration: number;
}

@Injectable()
export class ButtonService {

  private pressed = {};

  public buttonSubject: Subject<ButtonEvent>;

  constructor() {
    this.buttonSubject = new Subject<ButtonEvent>();
  }

  public handleEvent(event: KeyboardEvent) {
    if (event.type === 'keydown') {
      if (this.pressed[event.which]) {
        return;
      }
      this.pressed[event.which] = event.timeStamp;
    } else if (event.type === 'keyup') {
      if (!this.pressed[event.which]) {
        return;
      }

      const duration = (event.timeStamp - this.pressed[event.which]) / 1000;

      let buttonNum;

      switch (event.which) {
        case 81:
          buttonNum = 1;
          break;
        case 87:
          buttonNum = 2;
          break;
        case 69:
          buttonNum = 3;
          break;
        case 82:
          buttonNum = 4;
          break;
      }

      if (buttonNum) {
        this.buttonSubject.next({buttonNum: buttonNum, duration: duration});
      }

      this.pressed[event.which] = 0;
    }
  }

}
