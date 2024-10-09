import { Component, OnInit, Inject, Input } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Student } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';
import { NavigationExtras, Router } from '@angular/router';
import { LegacyDialogPosition as DialogPosition, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-duration-box',
  templateUrl: './duration-box.component.html',
  styleUrls: ['./duration-box.component.css']
})
export class DurationBoxComponent implements OnInit {
  reason: string = '';
  hostel: string = '';
  roomNo: string = '';
  rebateStart: string = '';
  rebateEnd: string = '';
  roll_no: string = '';
  isOfficialRebate: boolean = false;
  isOfficialRebateString: any;
  officialRebateFile: any;
  isUpdateRequest: boolean = false;
  rebateID: string = '';
  rebate_docname: string = "";

  new_rebateEnd: string = '';
  new_rebateStart: string = '';

  constructor(private service: StudentdataService,
    private auth:AuthService,
    public dialog_ref: MatDialogRef<DurationBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public injected_data: any){}

  ngOnInit(): void {
    // this.dialog_ref.updateSize('50%', '30%');
    this.rebateID = this.injected_data.id;
    this.rebateStart = this.injected_data.start_date;
    this.reason = this.injected_data.reason;
    this.rebateEnd = this.injected_data.end_date;
    this.isOfficialRebate = this.injected_data.official;
  }

  onNoClick(): void{
    this.dialog_ref.close();
  }

  makeShrinkRequest(){
    // print all the important data to the console
    // console.log(this.rebateID)
    // console.log("Reason: " + this.reason);
    // console.log("Rebate Start: " + this.new_rebateStart);
    // console.log("Rebate End: " + this.new_rebateEnd);
    this.service.updateRebate(this.auth.roll_no,this.rebateID,"",this.service.resolveDateFormat(this.new_rebateStart),this.service.resolveDateFormat(this.new_rebateEnd),this.isOfficialRebate,"").
    then(
      (res:any)=>{
        console.log(res);
        window.alert(res.message);
        // close the dialog box
        this.dialog_ref.close();
        window.location.reload();
      }
    ).
    catch(
      (err)=>{
        console.log(err);
        window.alert(err.error.error);
      });
  }



  // import { Component, Inject, Input, OnInit } from '@angular/core';
  // import { DialogPosition, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
  // import { DialogData, Student } from 'src/app/interfaces';
  // import { StudentdataService } from 'src/app/studentdata.service';
  // import { RebateRequest } from 'src/app/interfaces';
  
  // //https://material.angular.io/components/dialog/overview
  // @Component({
  //   selector: 'app-stu-rebate-dialog',
  //   templateUrl: './stu-rebate-dialog.component.html',
  //   styleUrls: ['./stu-rebate-dialog.component.css']
  // })
  // export class StuRebateDialogComponent implements OnInit {
  //   // @Input()
  //   includeCSV:boolean = true;
  //   data : DialogData
  //   constructor(
  //     public dialogRef: MatDialogRef<StuRebateDialogComponent>,
  //     @Inject(MAT_DIALOG_DATA) public injected_data: any,
  //     private data_service : StudentdataService 
  //   ) {
  //     console.log(this.injected_data['includeCSV'])
  //     if(this.injected_data['includeCSV'] != undefined){
  //     this.includeCSV = this.injected_data['includeCSV']
  //     }
  //    }
  
  //   getRebates = () => this.data_service.getAdminRebatesRoll(this.injected_data['roll'])
  
  //   ngOnInit(): void {
  //     this.dialogRef.updateSize('65%','80%')
  //   }
  
  //   onNoClick(): void{
  //     this.dialogRef.close()
  //   }
  
  // }
  
}
