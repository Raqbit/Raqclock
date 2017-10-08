import {Component, OnInit} from '@angular/core';
import {ButtonEvent, ButtonService} from "../../core/services/button.service";
import {Router} from "@angular/router";

@Component({
  selector: 'rqc-menupage',
  templateUrl: './menupage.component.html',
  styleUrls: ['./menupage.component.css']
})
export class MenupageComponent implements OnInit {

  constructor(private _router: Router,
              private _button: ButtonService) {
  }

  ngOnInit() {
    this._button.buttonSubject.subscribe((buttonPress: ButtonEvent) => {
      if(buttonPress.buttonNum === 1){
        this._router.navigate(['']);
      }
    });
  }
}
