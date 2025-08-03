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

  allowedHostels:boolean[] = new Array<boolean>(22);
  guestHistory:any = {exists:true, loaded:false};
  headers = ['Token No.','Roll No.','Name','Hostel']
  isAdmin = false;
  currentFormData: any = null;

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

  cleanData(history: any) {
    if (Object.keys(history).length) {
      let body = [];
      for (let key in history["data"]["guests"]) {
        let rollNo = Object.keys(history["data"]["guests"][key])[0]
        let guest = []
        guest.push(history["data"]["guests"][key][rollNo]["index"]) // Token no
        guest.push(rollNo) // Roll no
        guest.push(history["data"]["guests"][key][rollNo]["fullname"]) // Name
        guest.push(history["data"]["guests"][key][rollNo]["hostel"]) // Hostel
        guest.push(key) // Guest ID
        guest.push(history["data"]["guests"][key][rollNo]["payment_status"] || "unpaid")
        // Payment status
        guest.push(history["data"]["guests"][key][rollNo]["excessive_no_shows"] || false)
        guest.push(history["data"]["guests"][key][rollNo]["no_show_count"] || 0)
        
        body.push(guest)
      }
      this.headers = ['Token No.', 'Roll No.', 'Name', 'Hostel', 'Actions'];
      let res = { headers: this.headers, body: body }
      return res;
    }
    return {}
  }
  
  getGuestList(data: any) {
    this.currentFormData = data.form.value;
    this.guestHistory = {}
    if (data.form.value.date && data.form.value.meal) {
      this.guestService.getGuestHostelData(
        data.form.value.hostel,
        this.guestService.resolveDateFormat(data.form.value.date),
        data.form.value.meal
      ).then((res) => {
        let history = res;
        this.guestHistory = this.cleanData(history);
      }).catch((res) => {
        this.guestHistory = this.cleanData({})
        console.log(this.guestHistory)
      });
    }
  }

  isHistoryEmpty(history:any){
    return history !== undefined && history?.length > 0;
  }
  
  updatePaymentStatus(roll: string, status: string, hostelParam?: string) {
    if (!this.currentFormData) {
      alert("No form data available. Please search again.");
      return;
    }

    const date = this.guestService.resolveDateFormat(this.currentFormData.date);
    const meal = this.currentFormData.meal;
    const data: any = {
      roll: roll,
      date: date,
      meal: meal,
      payment_status: status
    };
    
    if (this.isAdmin && hostelParam) {
      data.guesthostel = hostelParam;
    }

    this.guestService.updatePaymentStatus(data).then((res: any) => {
      if (this.guestHistory && this.guestHistory.body) {
        for (let row of this.guestHistory.body) {
          if (row[1] === roll) {
            row[5] = status;
          }
        }
      }
      
      alert(`Status updated to: ${status}`);
    }).catch((err) => {
      console.error("Error updating payment status:", err);
      alert("Failed to update status");
    });
  }
      
}
