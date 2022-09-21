import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';

import { StudentListComponent } from './student-list/student-list.component';
import { RebateComponent } from './rebate/rebate.component';

import { StudentsComponent } from './students/students.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'student',component:DashboardComponent},
  {path:'login',component:LoginComponent},
  {path:'overview',component:OverviewComponent},
  {path:'student-list',component:StudentsComponent},

  {path:'list',component:StudentListComponent},
  {path:'rebate',component:RebateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
