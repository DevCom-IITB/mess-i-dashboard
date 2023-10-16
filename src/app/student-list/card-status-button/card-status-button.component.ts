import { Component, OnInit, Input } from '@angular/core';
import { Student } from '../../interfaces';
import { StudentdataService } from '../../studentdata.service';

@Component({
  selector: 'app-card-status-button',
  templateUrl: './card-status-button.component.html',
  styleUrls: ['./card-status-button.component.css']
})
export class CardStatusButtonComponent implements OnInit {

  process:boolean=false;
  @Input() rollNumber: any;
  student : any;
  student_data : any;
  mess_data:any;
  noOfDays:any;
  date = new Date();
  studentImage:any;
  isImageLoading:any;
  headers = ['Day','Breakfast','Lunch','Snacks','Dinner','Milk','Egg','Fruit']

  constructor(private service: StudentdataService) {
   }

  ngOnInit(): void {
    this.fetch_student(this.rollNumber); 
  }

  async fetch_student(rollNum: any){
    if(this.service.studentCache.has(rollNum)){
      this.student = this.service.studentCache.get(this.rollNumber);
    }else{
      //make an api call if data not present in the this.studentCache    
      this.service.getStudentData(this.rollNumber).then((res)=>{
        this.student_data = res;
        var temp_student = {
        id: this.student_data.roll,
        name: this.student_data.name,
        hostel: this.student_data.hostel,
        room: this.student_data.room,
        card_status: this.student_data.allowed
      } as Student;

      this.service.put_student_in_cache(temp_student);     
      this.student = this.service.studentCache.get(this.rollNumber);

    }).catch((res)=>{
      console.log(res)
    })
    }
  }

  async toggl(){
    this.process=true;
    await this.service.togglActive(this.rollNumber).then((res)=>{
      if (res){
        this.student.card_status  = ! this.student.card_status;
      }
    }).catch((res)=>{
      alert("Unable to toggle");
      console.log(res);
    });
    this.process=false;
  }

}
