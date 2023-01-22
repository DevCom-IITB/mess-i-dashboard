import { Component, Inject, OnInit } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, Student } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';

//https://material.angular.io/components/dialog/overview
@Component({
  selector: 'app-stu-rebate-dialog',
  templateUrl: './stu-rebate-dialog.component.html',
  styleUrls: ['./stu-rebate-dialog.component.css']
})
export class StuRebateDialogComponent implements OnInit {
  data : DialogData
  constructor(
    public dialogRef: MatDialogRef<StuRebateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public injected_data: any,
    private data_service : StudentdataService 
  ) {
    // console.log(roll['roll'])
    // console.log(injected_data['roll'])
    // console.log(injected_data)
    this.fetch_student_data(injected_data['roll'])
   }

  fetch_student_data(roll:any) {
    this.data_service.getAdminRebatesRoll(roll).then((res:any) => {
      this.data = 
          { 
            accepted_rebates : res.accepted_rebate,
            rejected_rebates: res.rejected_rebate,
            pending_rebates: res.pending_rebate
          }
        console.log(this.data)
      }).catch((e)=>
      console.log(e))

  }

  ngOnInit(): void {
    this.dialogRef.updateSize('45%','80%')
  }

  onNoClick(): void{
    this.dialogRef.close()
  }

}
