import { AuthService } from 'src/app/auth.service';
import { Component, OnInit } from '@angular/core';
import { GuestdataService } from 'src/app/guestdata.service';
import { Guest } from 'src/app/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-entry-form',
  templateUrl: './guest-entry-form.component.html',
  styleUrls: ['./guest-entry-form.component.css']
})
export class GuestEntryFormComponent implements OnInit {

  allowedHostels:boolean[] = new Array<boolean>(22);
  guest:any;
  guest_detail:any;
  Msg: any ;
  available:string;


 
  guestHostel: string ='';
  meal: string='' ;
  date: string='' ;

  constructor(private auth:AuthService,private router:Router, private guestService:GuestdataService) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    let current_state = this.router.getCurrentNavigation()?.extras.state;
    if(current_state != undefined){
      this.guestHostel = current_state?.guestHostel;
      this.meal = current_state?.meal;
      this.date = this.guestService.resolveDateFormat(current_state?.date);
    }
  }

  ngOnInit(): void {
    this.getGuestHostel()
    this.fetch_guest(this.auth.getRoll())
  }

  async search(evt:Event){
    if (this.guestService.bookingValidity(this.guestHostel,this.meal,this.date)){
      await this.guestService.getavailability(this.guestHostel,this.guestService.resolveDateFormat(this.date),this.meal).then((res)=>{
        let guesthostelData= res as any;
        this.available=guesthostelData['current availability'].toString()+'/'+guesthostelData['total availability'].toString()
        console.log(this.available)
      }).catch((res)=>{
        console.log(res)
      })
    }
    console.log(evt)
  }

  async fetch_guest(rollNum: any){
    if(this.guestService.guestCache.has(rollNum)){
      this.guest = this.guestService.guestCache.get(rollNum);
    }else{
      //make an api call if data not present in the this.studentCache    
      this.guestService.getGuestDetail(rollNum).then((res)=>{
        this.guest_detail = res;
        var temp_guest = {
        id: this.guest_detail.roll,
        name: this.guest_detail.name,
        hostel: this.guest_detail.hostel,
      } as Guest;

      this.guestService.put_guest_in_cache(temp_guest);     
      this.guest = this.guestService.guestCache.get(rollNum);

    }).catch((res)=>{
      console.log(res)
    })
    }
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

  submitEntry(){
    if(this.guestService.bookingValidity(this.guestHostel,this.meal,this.date)){
      this.guestService.addGuest(this.guest.name,this.guest.hostel,this.guestHostel,this.meal,this.guestService.resolveDateFormat(this.date)).then((res)=>{
        this.Msg=res
        console.log(this.Msg)
        alert(this.Msg["message"])
        this.router.navigateByUrl('/guest-entry')
      }).catch((res)=>{
        console.log(res)
        alert(res.error["error"]);
      })
    }
  }

  
}
