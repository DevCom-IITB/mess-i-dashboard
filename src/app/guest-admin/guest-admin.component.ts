import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
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
  hostel: string='' ;
  meal: string='' ;
  date: string ;
  headers = ['S. No.','Roll No.','Name','Hostel']

  constructor(private auth:AuthService, private service:StudentdataService, private guestService:GuestdataService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    let current_state = this.router.getCurrentNavigation()?.extras.state;
    if(current_state != undefined){
      this.hostel = current_state?.hostel;
      this.meal = current_state?.meal;
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
    if(Object.keys(history).length){
      let body=[];
      let i=0;
      for(let key in history["data"]["guests"]){
        let guest=[]
        guest.push(`${++i}`)
        guest.push(key)
        guest.push(history["data"]["guests"][key]["fullname"])
        guest.push(history["data"]["guests"][key]["hostel"])
        body.push(guest)
      }
      let res={headers:this.headers,body:body}
      return res;
    }
    return {}
  }


  getGuestList(){
    this.guestHistory={}
    if (this.hostel && this.meal && this.date) {
      if(this.date===""){
        alert("Date is required")
      }else{
        this.guestService.getGuestHostel(this.hostel,this.resolveDateFormat(this.date),this.meal).then((res)=>
        {
          let history = res;
          this.guestHistory = this.cleanData(history);
        }).catch((res)=>{
          console.log(res)
          this.guestHistory = this.cleanData({})
        });
        }
      
    }else{
    }
    
  }

  isHistoryEmpty(history:any){
    return Object.keys(history).length === 0;
  }

  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }

}
