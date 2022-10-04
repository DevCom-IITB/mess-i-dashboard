import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RebateRequest, Student } from '../interfaces';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  styleUrls: ['./rebate.component.css']
})
export class RebateComponent implements OnInit {

  public user_name: string = "H9 Hall Manager";
  public pending_rebates: RebateRequest[] = new Array();
  devices:any;

  constructor(private data_service:StudentdataService, private auth_service: AuthService, private router: Router) { 
  }

  ngOnInit(): void {
    this.initialise();
    this.dummyInitialise();
    if(!this.auth_service.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  async initialise(){
    this.data_service.getStudentRebates().then((res)=>{
      this.populateRebates(res);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
    
    this.data_service.getDevices().then((res)=>{
      this.devices = res;
      console.log(this.devices);
    }).catch((e)=>{
      console.log(e);
    });
  }

  populateRebates(response: any): void{
    console.log(response);
    this.pending_rebates = response;
  } 

  dummyInitialise(): void{
    this.pending_rebates.push({
      student:{
        id: "210070028",
        name: "Dheer Banker",
      } as Student,
      recieve_date: new Date(Date.UTC(2022, 12, 28, 11, 23, 22)),
      rebate_duration_start: new Date(Date.UTC(2022, 10, 25, 11, 23, 22)),
      rebate_duration_end: new Date(Date.UTC(2022, 11, 29, 11, 23, 22)),
    } as RebateRequest);
    this.pending_rebates.push({
      student:{
        id: "210051128",
        name: "Rahul Kumari",
      } as Student,
      recieve_date: new Date(Date.UTC(2022, 12, 28, 11, 23, 22)),
      rebate_duration_start: new Date(Date.UTC(2022, 10, 25, 11, 23, 22)),
      rebate_duration_end: new Date(Date.UTC(2022, 11, 29, 11, 23, 22)),
    } as RebateRequest);
  }

}
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../auth.service';
// import { StudentdataService } from '../studentdata.service';


// @Component({
//   selector: 'app-rebate',
//   templateUrl: './rebate.component.html',
//   styleUrls: ['./rebate.component.css']
// })
// export class RebateComponent implements OnInit {

//   messHistory:any;
//   date = new Date();
//   noOfDays:any;
//   totalMeals:any;
//   headers = ['Breakfast','Lunch','Snacks','Dinner','Milk','Egg']
//   studentData: any;

//   constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
//     if(!this.auth.isLoggedIn()){
//       this.router.navigate(['login'])
//     }
//   }

//   ngOnInit(): void {
//   }

//   async submitRebate(search: any){
//     this.service.setStudentRebate(search.form.value.rollnumber,search.form.value.startDate,search.form.value.endDate).then((res)=>{
//       alert("Rebate successfully added")
      
//   }).catch((res)=>{
//     alert("Rebate was not added!!")
//   })
// }

// }
