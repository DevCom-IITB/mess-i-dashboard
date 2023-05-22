import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {HttpClientModule} from '@angular/common/http';
import { OverviewComponent } from './overview/overview.component';
import { StudentListComponent } from './student-list/student-list.component'
import { RebateComponent } from './rebate/rebate.component';
import { HomeComponent } from './home/home.component';
import { PdRebateCardComponent } from './rebate/pd-rebate-card/pd-rebate-card.component';
import { StudentcardComponent } from './studentcard/studentcard.component';
import { InputFieldComponent } from './utils/input-field/input-field.component'
import { TableComponentComponent } from './components/table_component/table-component.component';
import { DevicesComponent } from './home/devices/devices.component';
import { RebateFormComponent } from './rebate/rebate-form/rebate-form.component';
import { RebateCardComponent } from './rebate/rebate-card/rebate-card.component';
import { StuRebCardComponent } from './rebate/stu-reb-card/stu-reb-card.component';
import { RebateAdminComponent } from './rebate-admin/rebate-admin.component';
import { MessBillComponent } from './mess-bill/mess-bill.component';
import { FormMessBillComponent } from './components/form-mess-bill/form-mess-bill.component';
import { StuRebateDialogComponent } from './components/stu-rebate-dialog/stu-rebate-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './utils/checkbox/checkbox.component';
import { DateFilterComponent } from './utils/date-filter/date-filter.component';
import { RebateListComponent } from './utils/rebate-list/rebate-list.component';
import { DurationBoxComponent } from './utils/duration-box/duration-box.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    StudentListComponent,
    RebateComponent,
    HomeComponent,
    PdRebateCardComponent,
    StudentcardComponent,
    InputFieldComponent,
    TableComponentComponent,
    DevicesComponent,
    RebateFormComponent,
    RebateCardComponent,
    StuRebCardComponent,
    RebateAdminComponent,
    MessBillComponent,
    FormMessBillComponent,
    StuRebateDialogComponent,
    CheckboxComponent,
    DateFilterComponent,
    RebateListComponent,
    DurationBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
