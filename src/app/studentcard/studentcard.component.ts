import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../interfaces';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-studentcard',
  templateUrl: './studentcard.component.html',
  styleUrls: ['./studentcard.component.css']
})
export class StudentcardComponent implements OnInit {
  rollNumber: any;
  student : any;
  constructor(private route: ActivatedRoute, private service: StudentdataService) {
   }

  ngOnInit(): void {
    this.rollNumber = this.route.snapshot.queryParams['rollNum'];
    this.fetch_student(this.rollNumber) 
  }

  async fetch_student(rollNum: any){
    if(this.service.studentCache.has(rollNum)){
      this.student = this.service.studentCache.get(this.rollNumber);
    }

    else{
      //make an api call if data not present in the this.studentCache    
    }
  }


}
