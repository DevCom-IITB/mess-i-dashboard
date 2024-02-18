import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import { GuestdataService } from 'src/app/guestdata.service';

@Component({
  selector: 'app-guest-status-button',
  templateUrl: './guest-status-button.component.html',
  styleUrls: ['./guest-status-button.component.css']
})
export class GuestStatusButtonComponent implements OnInit {

  process:boolean=false;

  @Input() meal:any;
  @Input() date:any;
  @Input() guestHostel:any;
  @Input() guestStatus:boolean;
  @Output() public updateList = new EventEmitter();
  constructor( private service:GuestdataService) {
  }

  ngOnInit(): void {
  }

  async toggl(){
    this.process=true;
    await this.service.removeGuest(this.guestHostel, this.meal.toLowerCase(), this.date).then((res)=>{
      if (res){
        this.guestStatus  = ! this.guestStatus;
        alert("Withdraw Successful")
        this.updateList.emit();
      }
    }).catch((res)=>{
      alert("Unable to Withdraw");
      console.log(res);
    });
    this.process=false;
  }

}
