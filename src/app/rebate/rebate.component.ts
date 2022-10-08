import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StudentdataService } from '../studentdata.service';


@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  styleUrls: ['./rebate.component.css']
})
export class RebateComponent implements OnInit {

  messHistory:any;
  date = new Date();
  noOfDays:any;
  totalMeals:any;
  headers = ['Breakfast','Lunch','Snacks','Dinner','Milk','Egg']
  studentData: any;

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  async submitRebate(search: any){
    this.service.setStudentRebate(search.form.value.rollnumber,search.form.value.startDate,search.form.value.endDate).then((res)=>{
      alert("Rebate successfully added")
      
  }).catch((res)=>{
    alert("Rebate was not added!!")
  })
}

}
