import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StuRebateDialogComponent } from '../components/stu-rebate-dialog/stu-rebate-dialog.component';
import { RebateRequest } from '../interfaces';
import { StudentdataService } from '../studentdata.service';
import {saveAs} from 'file-saver-es';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-rebate-admin',
  templateUrl: './rebate-admin.component.html',
  styleUrls: ['./rebate-admin.component.css']
})
export class RebateAdminComponent implements OnInit {
  app_bar_suffix: string = "Rebates";
  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  currTab: String = "pending";
  CSV_fields : string[] = ["id","roll","start", "end", "rebate_docname","official","comment","reason","request_date"];
  includeCSV:boolean = true;

  constructor(private filter_service:FilterService, private data_service:StudentdataService,private auth:AuthService,private dialog:MatDialog, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.initialise();
  }

  initialise(): void {
    // // Populate with dummy data
    this.accepted_rebates = [
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'John Doe',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: 'Dr. Smith',
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      },
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe 2',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'John Doe 2',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: 'Dr. Smith',
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      },
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'John Doe',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: 'Dr. Smith',
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      },
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe 2',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'John Doe 2',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: 'Dr. Smith',
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      }
    ];
    
   }

  updateTab(tabName: string): void {
    // This would typically fetch data based on the selected tab
    console.log(`Tab changed to: ${tabName}`);
    // For now, we're using the data already loaded in initialise()
  }

  updateList(event: any): void {
    // This would typically refresh data after an update
    console.log('Update requested', event);
    this.initialise();
  }

  initialiseWithFilter(dateRange: any): void {
    console.log('Filter applied:', dateRange);
    // In a real app, this would filter the data based on date range
    // For now, just use the same dummy data
    this.initialise();
  }

  downloadCSV(): void {
    console.log('Download CSV requested');
    // This would export the current data as CSV
    alert('CSV download would start here in a real implementation');
  }
}
