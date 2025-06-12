import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RebateRequest } from '../interfaces';
import { StudentdataService } from '../studentdata.service';


@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  styleUrls: ['./rebate.component.css']
})
export class RebateComponent implements OnInit {

  studentData: any;
  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  app_bar_suffix: string = 'Rebates';

  constructor(public data_service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    if(!this.auth.isStudent() ){
      this.router.navigate(['landing'])
    }
  }

  
  ngOnInit(): void {
    this.pending_rebates = [
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'Ganesh Preetham Vulise',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: true,
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      }
    ];
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
        fullname: 'Ganesh Preetham Vulise',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: true,
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      }
    ];
    this.rejected_rebates = [
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'Ganesh Preetham Vulise',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: true,
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      }
    ];
  }
  getRebates = () => this.data_service.getStudentRebates();
  // getRebates = {
  //   "pending_rebates": this.pending_rebates,
  //   "accepted_rebates": this.accepted_rebates,
  //   "rejected_rebates": this.rejected_rebates
  // }
  
}
