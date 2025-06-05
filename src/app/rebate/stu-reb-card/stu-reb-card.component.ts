import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { saveAs } from 'file-saver-es';
import { AuthService } from 'src/app/auth.service';
import { RebateRequest } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';
import { MatDialog } from '@angular/material/dialog';
import { DurationBoxComponent } from 'src/app/utils/duration-box/duration-box.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-stu-reb-card',
  templateUrl: './stu-reb-card.component.html',
  styleUrls: ['./stu-reb-card.component.css']
})
export class StuRebCardComponent implements OnInit {

  public p_request_recieved: string;
  public p_rebate_start: string;
  public p_rebate_end: string;
  public p_rebate_days: string;
  public p_rebate_reason: string;
  public p_rebate_comment: string;
  private numToMonth: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  @Input() public rebate_request: RebateRequest;
  // @Input() public isApproved: boolean = false;
  public on_admin_page:boolean ;
  private adminRoutes: string[] = ["/rebate-admin","/studentcard"];
  @Input() public approval_state: string = "accepted";
  @Input() public toggle: boolean; // used to toggle the view of the card
  @Output() public updateList = new EventEmitter();

  constructor(private dialog:MatDialog,private data_service:StudentdataService, private auth_service:AuthService, private router: Router, public auth:AuthService) { }


  ngOnInit(): void {
    // this.dummyInitialise();
    
    let rr = new Date(Date.parse(this.rebate_request.request_date));
    this.p_request_recieved = `${rr.toLocaleDateString()}, ${rr.toTimeString().slice(0,8)}`;
    this.p_rebate_start = this.readableDateFromString(this.rebate_request.start);
    this.p_rebate_end = this.readableDateFromString(this.rebate_request.end);
    this.p_rebate_reason = "";
    this.p_rebate_reason = this.rebate_request.reason;
    this.p_rebate_comment = this.rebate_request?.comment ?? "";
    this.p_rebate_days = this.noOfDays(this.rebate_request.start, this.rebate_request.end);
    this.toggle = this.rebate_request.official;
    this.on_admin_page = this.adminRoutes.some(sub => this.router.url.startsWith(sub));
  }

  readableDate(inp: Date): string{
    return `${inp.getDate()} ${this.numToMonth[inp.getMonth()]} ${inp.getFullYear()}`;
  }

  readableDateFromString(inp: string, separator: string = '-'): string{
    let all = inp.split(separator);
    return `${all[0]} ${this.numToMonth[parseInt(all[1])-1]} ${all[2]}`;
  }

  // generateRebateID(startDate: string,endDate: string, rollNo: string){
  //   return rollNo+'_'+startDate+'_'+endDate;
  // }
  updateRebateData(rebateReason: string, startDate: string, endDate: string){
    // let rebate_id : string = this.generateRebateID(startDate,endDate,this.auth_service.getRoll());
    let rebate_id : string = this.rebate_request.id;

    // console.log(`Passing start: ${this.rebate_request.start} and end: ${this.rebate_request.end}`);
    let navigationExtras: NavigationExtras = {
      state: {
        id:this.rebate_request.id,
        reason:this.rebate_request.reason,
        // hostel:"",
        // roomNo:"",
        startDate: this.rebate_request.start,
        endDate: this.rebate_request.end,
        isUpdate: true,
        official: this.rebate_request.official,
        rebate_docname: this.rebate_request.rebate_docname,
      }
    };
    this.router.navigate(['/applyrebate'],navigationExtras);
  }

  updateAcceptedRebate(startDate: string, endDate: string){
    // let rebate_id: string = this.generateRebateID(startDate,endDate,this.auth_service.getRoll());
    let rebate_id : string = this.rebate_request.id;
    // initialise a pop out of duration box with the rebate data
    this.dialog.open( DurationBoxComponent,{
    data:{
          // roll: roll,
          id : rebate_id,
          reason : this.rebate_request.reason,
          start_date: this.rebate_request.start,
          end_date : this.rebate_request.end,
          official : this.rebate_request.official,
        }
    })
  
  }

  deleteRebate(){
    this.data_service.deleteRebate(this.auth_service.getRoll(),this.rebate_request.id).then((res)=>{
      alert("Rebate is deleted")
      this.updateList.emit(this.rebate_request.id);
    }).catch((e)=>{
      alert("Error occured while deleting the rebate");
      console.log(e);
    })
  }

  downloadRebateDoc(){
    console.log("download initiated")
    this.data_service.downloadRebateDocument(this.rebate_request.roll,this.rebate_request.id).then((res:any) => {
      saveAs(res,"doc.pdf")
    }).catch((e)=>{
      alert("error occured in downloading the file");
      console.log(e);
    })
  }
  isStudentPage() {
    // return this.auth.isStudent() && !this.on_admin_page;
    return true;
  }
  noOfDays(start: string, end: string): string{
    let startDate = new Date(Date.parse(start));
    let endDate = new Date(Date.parse(end));
    let diff = Math.abs(endDate.getTime() - startDate.getTime());
    let diffDays = 1 + Math.ceil(diff / (1000 * 3600 * 24)); 
    return diffDays.toString();
  }
  onToggleChange(event : MatSlideToggleChange): void {
    const isChecked = event.checked;
    this.toggle = isChecked;
    this.rebate_request.official = isChecked;
    console.log('Toggle state:', this.toggle);
  }
}

