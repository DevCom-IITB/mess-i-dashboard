import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RebateRequest, Student } from '../interfaces';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  app_bar_suffix : string = "Home";
  public pending_rebates: RebateRequest[] = new Array();
  mobile_cards: any = [
    {
      title: 'Rebates',
      redirect: '/rebate-admin',
      description: 'Review applications for rebates'
    },
    {
      title: 'Guest List',
      redirect: '/guest-admin',
      description: 'Meal coupons for your hostel'
    },
    {
      title: "Students' List",
      redirect: '/list',
      description: 'List of students and their details'
    },
    {
      title: 'Statistics',
      redirect: '/statistics',
      description: 'Watch your meals consumption'
    },
    {
      title: 'Devices',
      redirect: '/device-list',
      description: 'List of connected devices'
    },
  ];
  devices:any = [
    {
      hostel: 'Brahmaputra',
      id: '001',
      sync: '2025-04-22 14:30',
      version: '2.1.5',
      cards: 42
    },
    {
      hostel: 'Siang',
      id: '002',
      sync: '2025-04-22 15:45',
      version: '2.1.5',
      cards: 37
    },
    {
      hostel: 'Umiam',
      id: '003',
      sync: '2025-04-22 10:15',
      version: '2.1.4',
      cards: 53
    }];
  date:string;

  constructor(private data_service:StudentdataService, public auth_service: AuthService, private router: Router) { 
  }

  ngOnInit(): void {
    this.initialise();
    // this.dummyInitialise();
    if(!this.auth_service.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  async initialise(){
    this.data_service.getPendingRebates().then((res)=>{
      this.populateRebates(res);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
  

    this.data_service.getDevices().then((res)=>{
      this.devices = res;
    }).catch((e)=>{
      console.log(e);
    });
  }

  updateList(rebateID: any){
    this.pending_rebates = this.pending_rebates.filter((reb) =>{
      return reb.id != rebateID;
    })
  }

  populateRebates(response: any): void{
    this.pending_rebates = response;
  }
  redirect(card:any): void{
    this.router.navigate([card.redirect]);
  }
  isStudentPage(): boolean {
    return true
  }
}
