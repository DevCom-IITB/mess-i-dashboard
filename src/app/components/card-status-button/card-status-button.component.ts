import { Component, OnInit, Input } from '@angular/core';
import { StudentdataService } from '../../studentdata.service';

@Component({
  selector: 'app-card-status-button',
  templateUrl: './card-status-button.component.html',
  styleUrls: ['./card-status-button.component.css']
})
export class CardStatusButtonComponent implements OnInit {

  process:boolean=false;
  @Input() rollNumber: any;
  @Input() cardStatus:any;

  constructor(private service: StudentdataService) {
   }

  ngOnInit(): void {
  }

  async toggl(){
    this.process=true;
    await this.service.togglActive(this.rollNumber).then((res)=>{
      if (res){
        this.cardStatus  = ! this.cardStatus;
      }
    }).catch((res)=>{
      alert("Unable to toggle");
      console.log(res);
    });
    this.process=false;
  }

}
