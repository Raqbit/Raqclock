import { AlarmComponent } from './screens/alarm/alarm.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from 'app/screens/main/main.component';
import { ButtonmenuComponent } from './screens/menus/buttonmenu/buttonmenu.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MainComponent,
        AlarmComponent,
        ButtonmenuComponent
    ],
    exports: [
        MainComponent,
        AlarmComponent,
        ButtonmenuComponent
    ]
})
export class CoreModule { }
