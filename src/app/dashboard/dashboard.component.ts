import { Component, OnInit } from '@angular/core';
import {StudentdataService} from 'src/app/studentdata.service'
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'mess-i-dashboard';

  studentData:any;
  // {
  //   roll:"200020065",
  //   name:"K Adithya Krishna",
  //   hostel:"Hostel 9",
  //   room:"189",
  //   active:false
  // };

  ngOnInit(): void {
    
    
  }

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  async submit(search: any){
    this.studentData = await this.service.getStudentData(search.form.value.roll)
    console.log(this.studentData);
  }

  getMonthData(data: any){
    
    if (data.form.value.year&&data.form.value.month) {
      this.service.getMonthlydata(this.studentData.roll,data.form.value.year,data.form.value.month);
    }else{
      console.log(data.form.value.year)
      console.log(data.form.value.month)
    }
  }
  toggl(){
    console.log("click")
    let res = this.service.togglActive(this.studentData.roll)
    if (res){
      this.studentData.allowed = !this.studentData.allowed
    }
  }

}
