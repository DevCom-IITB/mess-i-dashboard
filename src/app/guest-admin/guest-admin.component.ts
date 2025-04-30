import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { GuestdataService } from '../guestdata.service';

@Component({
  selector: 'app-guest-admin',
  templateUrl: './guest-admin.component.html',
  styleUrls: ['./guest-admin.component.css']
})
export class GuestAdminComponent implements OnInit {

  app_bar_suffix: string = "Guest Booking";
  allowedHostels:boolean[] = new Array<boolean>(22);
  guestHistory:any = {exists:true, loaded:false};
  headers = ['Token No.','Roll No.','Name','Hostel']
  isAdmin = false;

  constructor(private auth:AuthService, private guestService:GuestdataService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    this.isAdmin = auth.isAdmin()
  }

  ngOnInit(): void {
    this.getGuestHostel()
  }

  getGuestHostel(){
    this.guestService.getGuestHostels().then((res:any)=>{
      for(let i=1; i<this.allowedHostels.length; i++){
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
      for(let key in history["data"]["guests"]){
        let rollNo = Object.keys(history["data"]["guests"][key])[0]
        let guest=[]
        guest.push(history["data"]["guests"][key][rollNo]["index"])
        guest.push(rollNo)
        guest.push(history["data"]["guests"][key][rollNo]["fullname"])
        guest.push(history["data"]["guests"][key][rollNo]["hostel"])
        body.push(guest)
      }
      let res={headers:this.headers,body:body}
      return res;
    }
    return {}
  }


  getGuestList(data:any){
    this.guestHistory={}
    if (data.form.value.date && data.form.value.meal) {
      this.guestService.getGuestHostelData(data.form.value.hostel,this.guestService.resolveDateFormat(data.form.value.date),data.form.value.meal).then((res)=>
        {
          let history = res;
          this.guestHistory = this.cleanData(history);
        }).catch((res)=>{
          this.guestHistory = this.cleanData({})
          console.log(this.guestHistory)

        });
    }else{
    }
    
  }

  isHistoryEmpty(history:any){
    return history !== undefined || !history?.length;
  }

}
