import { Component, Inject, OnInit } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, Student } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';
import { RebateRequest } from 'src/app/interfaces';

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
   }

  getRebates = () => this.data_service.getAdminRebatesRoll(this.injected_data['roll'])

  ngOnInit(): void {
    this.dialogRef.updateSize('58%','80%')
  }

  onNoClick(): void{
    this.dialogRef.close()
  }

}
