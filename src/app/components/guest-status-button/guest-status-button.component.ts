import { Component, OnInit,Input } from '@angular/core';
import { GuestdataService } from 'src/app/guestdata.service';

@Component({
  selector: 'app-guest-status-button',
  templateUrl: './guest-status-button.component.html',
  styleUrls: ['./guest-status-button.component.css']
})
export class GuestStatusButtonComponent implements OnInit {

  process:boolean=false;
  guestStatus:boolean=false;

  @Input() meal:any;
  @Input() date:any;
  @Input() guestHostel:any;
  constructor( private service:GuestdataService) {
  }

  ngOnInit(): void {
  }

  async toggl(){
    // this.process=true;
    // await this.service.addGuest(this.guestHostel, this.meal, this.date).then((res)=>{
    //   if (res){
    //     this.guestStatus  = ! this.guestStatus;
    //   }
    // }).catch((res)=>{
    //   alert("Unable to toggle");
    //   console.log(res);
    // });
    // this.process=false;
  }

}
