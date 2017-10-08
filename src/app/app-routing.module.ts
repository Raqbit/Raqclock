import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimepageComponent} from "./pages/timepage/timepage.component";
import {MenupageComponent} from "./pages/menupage/menupage.component";

const routes: Routes = [
  {
    path: '',
    component: TimepageComponent
  },
  {
    path: 'menu',
    component: MenupageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
