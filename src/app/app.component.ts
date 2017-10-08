import {Component, HostListener} from '@angular/core';
import {ButtonService} from "./core/services/button.service";

@Component({
  selector: 'rqc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _button: ButtonService){}

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent){
    this._button.handleEvent(event);
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent){
    this._button.handleEvent(event);
  }
}
