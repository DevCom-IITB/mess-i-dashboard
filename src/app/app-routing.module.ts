import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';

import { StudentListComponent } from './student-list/student-list.component';
import { RebateComponent } from './rebate/rebate.component';

import { HomeComponent } from './home/home.component';
import { StudentcardComponent } from './studentcard/studentcard.component';
import { RebateFormComponent } from './rebate/rebate-form/rebate-form.component';
import { RebateAdminComponent } from './rebate-admin/rebate-admin.component';


const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'overview',component:OverviewComponent},

  {path:'list',component:StudentListComponent},
  {path:'rebate',component:RebateComponent},
  {path:'studentcard',component:StudentcardComponent},
  {path: 'applyrebate',component:RebateFormComponent},
  {path: 'rebate-admin',component:RebateAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
