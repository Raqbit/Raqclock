import { AlarmService } from './shared/alarm.service';
import { TimeService } from './shared/time.service';
import { ButtonService } from './shared/button.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// electron
import { NgxElectronModule } from './ngx-electron/ngx-electron.module';

// app
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from 'app/core.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        NgxElectronModule,
        CoreModule
    ],
    providers: [ButtonService, TimeService, AlarmService],
    bootstrap: [AppComponent]
})
export class AppModule { }
