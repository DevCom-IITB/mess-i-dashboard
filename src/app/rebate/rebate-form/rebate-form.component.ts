import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StudentdataService } from 'src/app/studentdata.service';

@Component({
  selector: 'app-rebate-form',
  templateUrl: './rebate-form.component.html',
  styleUrls: ['./rebate-form.component.css']
})
export class RebateFormComponent implements OnInit {

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
