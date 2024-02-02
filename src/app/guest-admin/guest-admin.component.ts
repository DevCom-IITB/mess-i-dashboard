import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GuestdataService } from '../guestdata.service';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-guest-admin',
  templateUrl: './guest-admin.component.html',
  styleUrls: ['./guest-admin.component.css']
})
export class GuestAdminComponent implements OnInit {

  allowedHostels:boolean[] = new Array<boolean>(22);
  guestHistory:any;
  date: string = '';

  constructor(private auth:AuthService, private service:StudentdataService, private guestService:GuestdataService, private router:Router, private datePipe:DatePipe) {
    let current_state = this.router.getCurrentNavigation()?.extras.state;
    if(current_state != undefined){
      // this.date=current_state?.date;
      this.date = this.resolveDateFormat(current_state?.date);
    }
  }

  ngOnInit(): void {
    this.getAdminHostel()
  }

  getAdminHostel(){
    this.service.getAdminHostels().then((res:any)=>{
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

  cleanData(history:any){
    
  }

  getGuestList(data:any){
    console.log(this.date)
    if (data.form.value.hostel&&data.form.value.meal) {
      if(this.date===""){
        alert("Date is required")
      }else{
        // let day = new Date();
        // let today = this.datePipe.transform(day, 'dd-MM-yyyy')!
        // let duration= parseInt(this.date)-parseInt(today)
        // console.log(parseInt(today))
        this.guestService.getGuestHostel("H11","23-01-2024","breakfast").then((res)=>
      {
        let history = res;
        // console.log(res);
        this.guestHistory = this.cleanData(history);
        console.log(res);
      }).catch((res)=>{
        console.log(res)
        this.guestHistory = this.cleanData({})
      });
      }
      
    }else{
    }
    
  }

  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }

}
