import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DatePipe } from '@angular/common';
import { StudentdataService } from 'src/app/studentdata.service';
import { GuestdataService } from 'src/app/guestdata.service';

@Component({
  selector: 'app-guest-entry-form',
  templateUrl: './guest-entry-form.component.html',
  styleUrls: ['./guest-entry-form.component.css']
})
export class GuestEntryFormComponent implements OnInit {

  allowedHostels:boolean[] = new Array<boolean>(22);

  guestHostel: string ='';
  meal: string='' ;
  date: string ;

  name:string;
  hostel:string;
  student:any;
  student_data:any;
  guest_data:any;
  guestHostel_data:any;
  day1 = new Date();
  day = new Date();
  day2=this.day.setDate(this.day.getDate() + 1);
  day3=this.day.setDate(this.day.getDate() + 1);
  date1 = this.datePipe.transform(this.day1, 'dd-MM-yyyy')!
  date2 = this.datePipe.transform(this.day2, 'dd-MM-yyyy')!
  date3 = this.datePipe.transform(this.day3, 'dd-MM-yyyy')!
  errMsg: string ;

  constructor(private auth:AuthService,private router:Router, private studentService:StudentdataService, private guestService:GuestdataService, private datePipe:DatePipe) {
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
    // this.getGuestDetail(this.auth.getRoll(),this.today)
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
      for(let i=1; i<this.allowedHostels.length; i++){
        // console.log(res)
        this.allowedHostels[i] = false;
        if(res.includes(`H${i}`)){
          this.allowedHostels[i] = true;
        }
        if(res.includes("TANSA")){
          this.allowedHostels[21] = true;
        }
      }
    }).catch((res) =>{
      console.log(res)
    })
  }

  submitEntry(){
    if(this.guestHostel && this.meal && this.date){
      let duration=this.getDaysDifference(this.date1,this.resolveDateFormat(this.date))
      if(![0,1,2].includes(duration)){
        alert("You can only book within 3 days from today onward")
        return;
      }
      if(!duration && this.day1.getHours()-10 > 0 && this.meal ==="breakfast"){
        alert("Breakfast is over")
        return;
      }
      if(!duration && this.day1.getHours()-14 > 0 && this.meal ==="lunch"){
        alert("Lunch is over")
        return;
      }
      if(!duration && this.day1.getHours()-18 > 0 && this.meal ==="snacks"){
        alert("Snacks is over")
        return;
      }
      if(!duration && this.day1.getHours()-22 > 0 && this.meal ==="dinner"){
        alert("Dinner is over")
        return;
      }
      this.guestService.getGuestDetail(this.auth.getRoll(), this.resolveDateFormat(this.date)).then((res)=>{
        this.guest_data=res
        if(this.meal in this.guest_data["data"]){
          alert("Already Booked for given Date and Meal")
          return;
        }else{
          this.guestService.getGuestHostel(this.guestHostel, this.resolveDateFormat(this.date),this.meal).then((res)=>{
            this.guestHostel_data=res
            if(this.guestHostel_data["data"]["availability"]>0){
              this.guestService.addGuest(this.name,this.hostel,this.guestHostel,this.meal,this.resolveDateFormat(this.date)).then((res)=>{
                if (res){
                  alert("Guest Entry Booked")
                  this.router.navigate(['guest-entry'])
                  console.log(res);
                }
                
              }).catch((res)=>{
                this.errMsg =res;
              })     
            }
          }).catch((res)=>{
            this.errMsg=res;
          })
        }
      }).catch((res)=>{
        this.errMsg=res;
      })
    }
  }

  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }

  getDaysDifference(startDateStr: string, endDateStr: string){
    // Parse start date string into Date object
    const startDateParts = startDateStr.split('-').map(Number);
    const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
  
    // Parse end date string into Date object
    const endDateParts = endDateStr.split('-').map(Number);
    const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
  
    // Calculate the difference in milliseconds
    const differenceMillis = endDate.getTime() - startDate.getTime();
  
    // Convert the difference from milliseconds to days
    const differenceDays = Math.ceil(differenceMillis / (1000 * 60 * 60 * 24));
  
    return differenceDays;
  }

}
