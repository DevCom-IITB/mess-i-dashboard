import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  public pending_rebates: RebateRequest[] = new Array();
  devices:any;
  meal:string;
  date:string;
  history:any;
  guestHistory:any;

  constructor(private data_service:StudentdataService, public auth_service: AuthService, private router: Router, private datePipe:DatePipe, private http:HttpClient) { 
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

  // dummyInitialise(): void{
  //   this.pending_rebates.push({
  //     student:{
  //       id: "210070028",
  //       name: "Dheer Banker",
  //     } as Student,
  //     recieve_date: new Date(Date.UTC(2022, 12, 28, 11, 23, 22)),
  //     rebate_duration_start: new Date(Date.UTC(2022, 10, 25, 11, 23, 22)),
  //     rebate_duration_end: new Date(Date.UTC(2022, 11, 29, 11, 23, 22)),
  //   } as RebateRequest);
  //   this.pending_rebates.push({
  //     student:{
  //       id: "210051128",
  //       name: "Rahul Kumari",
  //     } as Student,
  //     recieve_date: new Date(Date.UTC(2022, 12, 28, 11, 23, 22)),
  //     rebate_duration_start: new Date(Date.UTC(2022, 10, 25, 11, 23, 22)),
  //     rebate_duration_end: new Date(Date.UTC(2022, 11, 29, 11, 23, 22)),
  //   } as RebateRequest);
  // }

  cleanData(history:any,date:string,meal:string){
    let body=[];
    for(let hostel of history){
      // console.log(hostel.data[0][date][meal]["guests"].length)
      let platedata=[];
      platedata.push(hostel.name)
      if (date in hostel.data[0]){
        console.log(hostel.data[0][date][meal])
        if((hostel.data[0][date][meal]["availability"]-hostel.data[0][date][meal]["guests"].length)>0){
          platedata.push("AVL")
          platedata.push(hostel.data[0][date][meal]["availability"]-hostel.data[0][date][meal]["guests"].length)
        }
        else{
          platedata.push("NA")
          platedata.push(0)
        }
      }
      else{
        platedata.push('AVL')
        platedata.push(1)
      }
      body.push(platedata)
    }
    return body
  }

  async getGuests(data: any){
    // this.getHostelPlates(data)
    if (data.form.value.day&&data.form.value.day) {
      let day = new Date();
      this.meal=data.form.value.meal
      day.setDate(day.getDate() + parseInt(data.form.value.day));
      this.date=this.datePipe.transform(day, 'dd-MM-yyyy')!
      this.http.get<any>('/assets/hostels.json').subscribe(data=>{
        this.history=data;
        this.guestHistory=this.cleanData(this.history,this.date,this.meal)
      });
      
    }else{
    }
  }

}
