import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimepageComponent} from "../pages/timepage/timepage.component";
import {TimeService} from "./services/time.service";
import { TimePipe } from './pipes/time.pipe';
import {ButtonService} from "./services/button.service";
import { MenupageComponent } from '../pages/menupage/menupage.component';
import {TimedisplayComponent} from "../pages/timepage/timedisplay/timedisplay.component";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TimeService,
    ButtonService
  ],
  declarations: [
    TimepageComponent,
    TimedisplayComponent,
    TimePipe,
    MenupageComponent,
  ]
})
export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
