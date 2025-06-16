import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { CardStatusButtonComponent } from './components/card-status-button/card-status-button.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { GuestEntryComponent } from './guest-entry/guest-entry.component';
import { GuestStatusButtonComponent } from './components/guest-status-button/guest-status-button.component';
import { GuestAdminComponent } from './guest-admin/guest-admin.component';
import { GuestEntryFormComponent } from './guest-entry/guest-entry-form/guest-entry-form.component';
import { LandingComponent } from './landing/landing.component';
import { MessManagerloginComponent } from './mess-managerlogin/mess-managerlogin.component';
import { ForgetPasswordComponent } from './mess-managerlogin/forget-password/forget-password.component';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { HomeCardComponent } from './components/home-card/home-card.component';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DeviceListComponent } from './device-list/device-list.component';
import { GuestCardComponent } from './components/guest-card/guest-card.component';


export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  };

@NgModule({ declarations: [
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
        CardStatusButtonComponent,
        StatisticsComponent,
        GuestEntryComponent,
        GuestStatusButtonComponent,
        GuestAdminComponent,
        GuestEntryFormComponent,
        LandingComponent,
        MessManagerloginComponent,
        ForgetPasswordComponent,
        AppBarComponent,
        HomeCardComponent,
        RebateCardComponent,
        DeviceListComponent,
        GuestCardComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule], providers: [DatePipe, provideHttpClient(withInterceptorsFromDi()),
            { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
            { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
        ] })
export class AppModule { }
