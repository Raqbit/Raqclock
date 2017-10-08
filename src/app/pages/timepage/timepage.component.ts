import {Component, HostBinding, OnInit} from '@angular/core';
import {TimeService} from "../../core/services/time.service";
import {ButtonEvent, ButtonService} from "../../core/services/button.service";
import {Router} from "@angular/router";

@Component({
  selector: 'rqc-timepage',
  templateUrl: './timepage.component.html',
  styleUrls: ['./timepage.component.css']
})
export class TimepageComponent implements OnInit {

  constructor(private _router: Router,
              private _button: ButtonService) {
  }

  ngOnInit() {
    this._button.buttonSubject.subscribe((buttonPress: ButtonEvent) => {
      this.handleButtons(buttonPress);
    });
  }

  private handleButtons(buttonPress: ButtonEvent) {
    switch (buttonPress.buttonNum) {
      case 1:
        this._router.navigate(['menu']);
        break;
      case 2:
        // Activate profile 1
        break;
      case 3:
        // Activate profile 2
        break;
      case 4:
        // Activate profile 3
        break;
    }
  }
}
