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
  public on_admin_page:boolean ;
  public isAdmin: boolean = false; // Assuming admin status is determined by the AuthService
  private adminRoutes: string[] = [];
  mobile_cards: any[] = [];
  devices:any[] = [];
  date:string;

  constructor(private data_service:StudentdataService, public auth_service: AuthService, private router: Router,private auth:AuthService) {
    this.mobile_cards = [
    {
      title: 'Rebates',
      redirect: '/rebate-admin',
      description: 'Review applications for rebates',
      role:'rebate'
    },
    {
      title: 'Guest List',
      redirect: '/guest-admin',
      description: 'Meal coupons for your hostel',
      role:'staff'
    },
    {
      title: "Students' List",
      redirect: '/list',
      description: 'List of students and their details',
      role:'staff'
    },
    {
      title: 'Statistics',
      redirect: '/statistics',
      description: 'Watch your meals consumption',
      role: this.auth_service.isStaff() ? 'staff' : 'student'
    },
    {
      title: 'Devices',
      redirect: '/device-list',
      description: 'List of connected devices',
      role: 'staff'
    },
  ]; 
  }

  ngOnInit(): void {
    this.initialise();
    // this.dummyInitialise();
    if(!this.auth_service.isLoggedIn()){
      this.router.navigate(['login'])
    }
    this.on_admin_page = this.adminRoutes.some(sub => this.router.url.startsWith(sub));
    this.isAdmin = this.auth.isAdmin();
    // this.on_admin_page = false;
  }

  async initialise(){
    this.data_service.getPendingRebates().then((res)=>{
      this.populateRebates(res);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
  

    this.data_service.getDevices().then((res)=>{
    if (Array.isArray(res)) {
      this.devices = res;
    } else {
      console.error('Expected devices to be an array but got:', res);
      this.devices = []; 
    }
  }).catch((e)=>{
    console.log(e);
  });
  }

  updateList(rebateID: any){
    this.pending_rebates = this.pending_rebates.filter((reb) =>{
      return reb.id != rebateID;
    })
  }
  shouldDisplay(role: string): boolean {
    switch (role) {
      case 'rebate': return this.auth_service.isRebate();
      case 'staff': return this.auth_service.isStaff();
      case 'studentOrStaff': return this.auth_service.isStudent() || this.auth_service.isStaff();
      default: return false;
    }
  }

  populateRebates(response: any): void{
    this.pending_rebates = response;
  }
  redirect(card:any): void{
    this.router.navigate([card.redirect]);
  }
  isStudentPage(): boolean {
    return this.auth.isStudent() && !this.on_admin_page;
    // return true;
  }

  logout(){
    this.auth.logoutUser().subscribe(
      (response) => {
        this.auth.logged_in=false;
        this.auth.token="";
        sessionStorage.removeItem("mess-i-token")
        sessionStorage.removeItem("mess-i-admin")
        sessionStorage.removeItem("mess-i-staff")
        sessionStorage.removeItem("mess-i-roll")
        sessionStorage.removeItem("mess-i-student")
        sessionStorage.removeItem("mess-i-rebate")
        sessionStorage.removeItem("mess-i-sso")
        this.auth.navigateToLogin();
      },
      (error) => {
        // Print error message
        console.error('Error occurred while logging out and calling API:', error);
      }
    );
  
  }
}
