import { AlarmComponent } from './screens/alarm/alarm.component';
import { Routes } from '@angular/router';
import { MainComponent } from 'app/screens/main/main.component';
/**
 * Define app module routes here, e.g., to lazily load a module
 * (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
 */
export const AppRoutes: Routes = [
    { path: '', component: MainComponent, pathMatch: 'full' },
    {
        path: 'menu', children: [
            // { path: 'main', component: MainmenuComponent }
        ]
    },
    { path: 'alarm', component: AlarmComponent }
];
