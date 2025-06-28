import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { saveAs } from 'file-saver-es';
import { MatDialog } from '@angular/material/dialog';
import { RebateRequest } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';
import { StuRebateDialogComponent } from 'src/app/components/stu-rebate-dialog/stu-rebate-dialog.component';
import { AuthService } from 'src/app/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { DurationBoxComponent } from 'src/app/utils/duration-box/duration-box.component';

@Component({
  selector: 'app-pd-rebate-card',
  templateUrl: './pd-rebate-card.component.html',
  styleUrls: ['./pd-rebate-card.component.css']
})
export class PdRebateCardComponent implements OnInit {

  @Input() public rebate_request: RebateRequest;
  @Output() public updateList = new EventEmitter<any>();

  public p_request_recieved: string;
  public p_rebate_start: string;
  public p_rebate_end: string;
  public p_rebate_reason: string;
  public p_rebate_days: string;
  public card_comment: string;
  public rebate_status: string;
  private numToMonth: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(
  private data_service: StudentdataService, 
  private dialog: MatDialog, 
  public auth: AuthService,
  private router: Router
) { }

  ngOnInit(): void {
    let rr = new Date(Date.parse(this.rebate_request.request_date));
    this.p_request_recieved = `${rr.toLocaleDateString()}, ${rr.toTimeString().slice(0,8)}`;
    this.p_rebate_start = this.readableDateFromString(this.rebate_request.start);
    this.p_rebate_end = this.readableDateFromString(this.rebate_request.end);
    this.p_rebate_reason = "";
    this.p_rebate_reason = this.rebate_request.reason;
    this.card_comment="";
    this.p_rebate_days= this.noOfDays(this.rebate_request.start, this.rebate_request.end);
  }

  acceptRebate(){
    this.data_service.acceptRebate(this.rebate_request.id, this.rebate_request.roll, this.card_comment).then(
      (res) => {
        window.alert(`Rebate for ${this.rebate_request.fullname} has been accepted successfully.`);
        this.updateList.emit(this.rebate_request.id);
      }
    ).catch(
      (e) => {
        console.log(e);
        window.alert("Error occurred while accepting rebate");
      }
    )
  }

  openDialog() :void {
    this.dialog.open(StuRebateDialogComponent,{
    data:{
      roll: this.rebate_request.roll,
      includeCSV:false
        }
    })
  }

  downloadRebateDoc() :void {
    this.data_service.downloadRebateDocument(this.rebate_request.roll,this.rebate_request.id).then((res:any) => {
      saveAs(res,"rebate_doc.pdf")
    }).catch((e)=>{
      window.alert("error in downloading file")
    })
  }

  rejectRebate(){
    this.data_service.rejectRebate(this.rebate_request.id, this.rebate_request.roll, this.card_comment).then(
      (res) => {
        window.alert(`Rebate for ${this.rebate_request.fullname} has been rejected.`);
        this.updateList.emit(this.rebate_request.id);
      }
    ).catch(
      (e) => {
        console.log(e);
        window.alert("Error occurred while rejecting rebate");
      }
    )
  }

  isAdmin(): boolean {
    return !this.auth.isStudent();
  }

  updateRebateData() {
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.rebate_request.id,
        reason: this.rebate_request.reason,
        startDate: this.rebate_request.start,
        endDate: this.rebate_request.end,
        isUpdate: true,
        official: this.rebate_request.official,
        rebate_docname: this.rebate_request.rebate_docname,
      }
    };
    this.router.navigate(['/applyrebate'], navigationExtras);
  }

  shrinkDuration() {
    this.dialog.open(DurationBoxComponent, {
      data: {
        roll: this.rebate_request.roll,
        id: this.rebate_request.id,
        reason: this.rebate_request.reason,
        start_date: this.rebate_request.start,
        end_date: this.rebate_request.end,
        official: this.rebate_request.official,
      }
    });
  }

  deleteRebate() {
    this.data_service.deleteRebate(this.auth.getRoll(), this.rebate_request.id).then((res) => {
      alert("Rebate has been cancelled");
      this.updateList.emit(this.rebate_request.id);
    }).catch((e) => {
      alert("Error occurred while cancelling the rebate");
      console.log(e);
    });
  }

  readableDate(inp: Date): string{
    return `${inp.getDate()} ${this.numToMonth[inp.getMonth()]} ${inp.getFullYear()}`;
  }

  readableDateFromString(inp: string, separator: string = '-'): string{
    let all = inp.split(separator);
    return `${all[0]} ${this.numToMonth[parseInt(all[1])-1]} ${all[2]}`;
  }

  noOfDays(start: string, end: string): string {
  try {
    const convertToDateObj = (dateStr: string) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    
    let startDate = convertToDateObj(start);
    let endDate = convertToDateObj(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.log("Invalid date conversion:", start, end);
      return "0";
    }
    
    let diff = Math.abs(endDate.getTime() - startDate.getTime());
    let diffDays = 1 + Math.ceil(diff / (1000 * 3600 * 24));
    
    return diffDays.toString();
  } catch (e) {
    console.error("Error calculating days:", e, "for dates:", start, end);
    return "0";
  }
}
}