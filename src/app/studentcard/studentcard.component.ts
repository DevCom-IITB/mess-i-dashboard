import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../interfaces';
import { StudentdataService } from '../studentdata.service';
import { StuRebateDialogComponent } from '../components/stu-rebate-dialog/stu-rebate-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RebateRequest } from '../interfaces';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-studentcard',
  templateUrl: './studentcard.component.html',
  styleUrls: ['./studentcard.component.css']
})
export class StudentcardComponent implements OnInit {
  app_bar_suffix : string = "Student Card";
  process:boolean=false;
  rollNumber: any;
  student : any;
  student_data : any;
  mess_data:any;
  noOfDays:any;
  date = new Date();
  studentImage:any;
  isImageLoading:any;
  currTab: string = 'pending';
  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  headers = ['Day','Breakfast','Lunch','Snacks','Dinner','Milk','  Egg  ','Fruit']
  toggle: boolean = false;

  constructor(private route: ActivatedRoute, private service: StudentdataService, private dialog:MatDialog, private router: Router) {
   }

  ngOnInit(): void {
    this.rollNumber = this.route.snapshot.queryParams['rollNum'];
    this.fetch_student(this.rollNumber);
    this.initialise();
  }
  initialise(): void {
    this.pending_rebates = [
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'Ganesh Preetham Vulise',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: false,
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      }
    ];
    this.accepted_rebates = [
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'Ganesh Preetham Vulise',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: true,
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      }
    ];
    this.rejected_rebates = [
      {
        id: 'REB001',
        student: {
          id: 'S12345',
          name: 'John Doe',
          hostel: 'Brahmaputra',
          room: 'A-101',
          card_status: true
        },
        fullname: 'Ganesh Preetham Vulise',
        roll: 'CS21B001',
        start: '2025-04-01',
        end: '2025-04-05',
        rebate_docname: 'medical_certificate.pdf',
        official: true,
        reason: 'Medical Leave',
        comment: 'Hospitalized for 5 days',
        request_date: '2025-03-29',
        room: 'A-101'
      }
    ];
  }

  async fetch_student(rollNum: any){
    this.getImageFromService();
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

  openDialog(roll:any) :void {
    console.log(roll)
    this.dialog.open(StuRebateDialogComponent,{
    data:{
      roll: roll
        }
    })
    // this.data_service.getAdminRebatesRoll(roll).then((res:any) => {
    //     this.dialog.open(StuRebateDialogComponent,{
    //     data:{accepted_rebates : res.accepted_rebate,
    //           rejected_rebates: res.rejected_rebate,
    //           pendeing_rebates: res.pending_rebate}
    // })
    // }).catch((e)=>
    // console.log(e))

  }


  cleanData(history:any){
    let body = [];
    let foot = [0,0,0,0,0,0,0];
    for(let j=0;j<this.noOfDays.length;j++){
      if(!(this.noOfDays[j] in history)){
        body.push([this.noOfDays[j],'-','-','-','-','-','-','-'])
      }else{
        let day = [this.noOfDays[j]];
        for(let k=1;k<this.headers.length;k++){
          if(this.headers[k] in history[this.noOfDays[j]]){
            day.push(history[this.noOfDays[j]][this.headers[k]]);
            foot[k-1]+=1;  
          }else{
            day.push('-');
          }
        }
        body.push(day);
      }
    }
    let footer = ["Total"];
    for(let i=0;i<foot.length;i++){
      footer.push(foot[i].toString());
    }
    let res = {headers:this.headers,body:body,footer:footer}
    return res;
    
  }

  async getMonthData(data:any){
    if (data.form.value.year&&data.form.value.month) {
      let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
      this.noOfDays = Array(num).fill(1).map((x, i) => (i + 1).toString());
      this.service.getMonthlydata(this.rollNumber,data.form.value.year,data.form.value.month).then((res)=>
      {
        let history = res;
        this.mess_data = this.cleanData(history);
      }).catch((res)=>{
        console.log(res)
        this.mess_data = this.cleanData({})
      });
      console.log(this.mess_data);
    }
  }

  getImageFromService() {
    this.isImageLoading = true;
    this.service.getImage(this.rollNumber).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  }
  createImageFromBlob(image: Blob) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
         this.studentImage = reader.result;
      }, false);
   
      if (image) {
         reader.readAsDataURL(image);
      }
  }
  goBack(): void {
    this.router.navigate(['/list']);
  }
  updateTab(tabName: string): void {
    this.currTab = tabName;
    // This would typically fetch data based on the selected tab
    console.log(`Tab changed to: ${tabName}`);
    // For now, we're using the data already loaded in initialise()
  }
  updateList(event: any): void {
    // This would typically refresh data after an update
    console.log('Update requested', event);
    this.initialise();
  }
  onToggleChange(event: MatSlideToggleChange): void {
    const isChecked = event.checked;
    this.toggle = isChecked;
    console.log('Toggle state:', this.toggle);
  }
}
