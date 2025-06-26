import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { GuestdataService } from '../guestdata.service';
import { FilterService } from '../filter.service';
// import { exists } from 'fs';
// import { exists } from 'fs';

@Component({
  selector: 'app-guest-admin',
  templateUrl: './guest-admin.component.html',
  styleUrls: ['./guest-admin.component.css']
})
export class GuestAdminComponent implements OnInit {

  app_bar_suffix: string = "Guest Booking";
  currTab: string = 'empty';
  allowedHostels:boolean[] = new Array<boolean>(22);
  guestHistory:any = {exists:true, loaded:false};
  meal: Array<string> = ['breakfast', 'lunch', 'snacks', 'dinner'];
  headers = ['Token No.','Roll No.','Name','Hostel']
  guestCardData: any[] = []; // list of lists
  isAdmin: boolean = false; // Assuming admin status is determined by the AuthService
  formData: any;

  constructor(private filter_service:FilterService, private auth:AuthService, private guestService:GuestdataService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    this.isAdmin = auth.isAdmin()
    // this.isAdmin = true;
  }

  ngOnInit(): void {
    this.getGuestHostel()
    // this.getGuestList({});
    }

  getGuestHostel(){
    console.log("Fetching allowed hostels for guest booking...");
    this.guestService.getGuestHostels().then((res:any)=>{
      // for(let i=1; i<this.allowedHostels.length; i++){
      for(let i=1; i<36; i++){
        this.allowedHostels[i] = false;
        if(res.includes(`H${i}`)){
          this.allowedHostels[i] = true;
        }
        if(res.includes("TANSA")){
          this.allowedHostels[21] = true;
        }
      }
      console.log("Allowed hostels for guest booking:", this.allowedHostels);
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
      let res={headers:this.headers,body:body,exists:true, loaded:true}
      console.log("Cleaned Data:", res);
      return res;
    }
    return {}
  }


  getGuestList(data:any){
    if(data.form.value['date'] == ''){
      alert("Please select a date");
    }
    if (data.form.value['meal'] == ''){
      data.form.value['meal'] = data.form.value['selectedMeal'];
    }
    this.formData = data.form.value;
    console.log(data.form.value);
    this.guestHistory={}
    if (data.form.value.date && data.form.value.meal) {
      // this.guestService.getGuestHostelData(data.form.value.hostel,this.guestService.resolveDateFormat(data.form.value.date),data.form.value.meal).then((res)=>
      this.guestService.getGuestHostelData("H34",this.guestService.resolveDateFormat(data.form.value.date),data.form.value.meal).then((res)=>
        {
          let history = res;
          this.guestHistory = this.cleanData(history);
          this.guestCardData = this.guestHistory.body;
          console.log("Guest Card Data:")
          console.log(this.guestCardData)
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
  updateTab(tabName: string, data: any): void {
    this.currTab = tabName;
    // This would typically fetch data based on the selected tab
    console.log(`Tab changed to: ${tabName}`);
    // For now, we're using the data already loaded in initialise()
  }

  downloadCSV(data:any) {
    if(data.loaded){
      console.log("Data to download:", data);
      this.filter_service.downloadTableAsCSV(data, "guest_data.csv");
    }
    else{
      alert("No data to download");
    }
  }
}
