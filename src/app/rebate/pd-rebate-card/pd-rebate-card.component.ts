import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { saveAs } from 'file-saver-es';
import { MatDialog } from '@angular/material/dialog';
import { RebateRequest } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';
import { StuRebateDialogComponent } from 'src/app/components/stu-rebate-dialog/stu-rebate-dialog.component';

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

  constructor(private data_service: StudentdataService,private dialog:MatDialog) { }

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
    this.data_service.acceptRebate(this.rebate_request.id,this.rebate_request.roll,this.card_comment).then(
      (res) => {
        this.updateList.emit(this.rebate_request.id);
      }
    ).catch(
      (e) =>{
        console.log(e);
        alert("Error occured while accepting rebate");
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
    this.data_service.rejectRebate(this.rebate_request.id,this.rebate_request.roll, this.card_comment).then(
      (res) => {
        this.updateList.emit(this.rebate_request.id);
      }
    ).catch(
      (e) =>{
        console.log(e);
        alert("Error occured while accepting rebate");
      }
    )
  }

  readableDate(inp: Date): string{
    return `${inp.getDate()} ${this.numToMonth[inp.getMonth()]} ${inp.getFullYear()}`;
  }

  readableDateFromString(inp: string, separator: string = '-'): string{
    let all = inp.split(separator);
    return `${all[0]} ${this.numToMonth[parseInt(all[1])-1]} ${all[2]}`;
  }

  noOfDays(start: string, end: string): string{
    let startDate = new Date(Date.parse(start));
    let endDate = new Date(Date.parse(end));
    let diff = Math.abs(endDate.getTime() - startDate.getTime());
    let diffDays = 1 + Math.ceil(diff / (1000 * 3600 * 24)); 
    return diffDays.toString();
  }
}