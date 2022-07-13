import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { RebateComponent } from './rebate/rebate.component';
import { StudentsComponent } from './students/students.component';

const routes: Routes = [
  {path:'student',component:DashboardComponent},
  {path:'login',component:LoginComponent},
  {path:'overview',component:OverviewComponent},
  {path:'student-list',component:StudentsComponent},
  {path:'rebate',component:RebateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
