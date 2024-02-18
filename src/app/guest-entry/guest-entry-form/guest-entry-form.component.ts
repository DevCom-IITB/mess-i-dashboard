import { AuthService } from 'src/app/auth.service';
import { Component, OnInit } from '@angular/core';
import { GuestdataService } from 'src/app/guestdata.service';
import { Router } from '@angular/router';
import { StudentdataService } from 'src/app/studentdata.service';

@Component({
  selector: 'app-guest-entry-form',
  templateUrl: './guest-entry-form.component.html',
  styleUrls: ['./guest-entry-form.component.css']
})
export class GuestEntryFormComponent implements OnInit {

  allowedHostels:string[] = new Array<string>(22);
  name:string;
  hostel:string;
  student:any;
  student_data:any;
  Msg: any ;

  guestHostel: string ='';
  meal: string='' ;
  date: string ;

  constructor(private auth:AuthService,private router:Router, private studentService:StudentdataService, private guestService:GuestdataService) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    let current_state = this.router.getCurrentNavigation()?.extras.state;
    if(current_state != undefined){
      this.guestHostel = current_state?.guestHostel;
      this.meal = current_state?.meal;
      this.date = this.resolveDateFormat(current_state?.date);
    }
  }

  ngOnInit(): void {
    this.getAdminHostel()
    this.fetch_student(this.auth.getRoll())
  }

  async fetch_student(rollNum: any){
    if(this.studentService.studentCache.has(rollNum)){
      this.student = this.studentService.studentCache.get(rollNum);
    }else{
      //make an api call if data not present in the this.studentCache    
      this.studentService.getStudentData(rollNum).then((res)=>{
        this.student_data = res;
        this.name= this.student_data.name,
        this.hostel= this.student_data.hostel
    }).catch((res)=>{
      console.log(res)
    })
    }
  }
  getAdminHostel(){
    this.studentService.getAdminHostels().then((res:any)=>{
      this.allowedHostels = res;
    }).catch((res) =>{
      console.log(res)
    })
  }

  submitEntry(){
    if(this.guestHostel && this.meal && this.date){
      this.guestService.addGuest(this.name,this.hostel,this.guestHostel,this.meal,this.resolveDateFormat(this.date)).then((res)=>{
        this.Msg=res
        alert(this.Msg["message"])
        this.router.navigateByUrl('/guest-entry')
      }).catch((res)=>{
        alert(res.error["error"]);
      })
    }
  }

  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }

}
