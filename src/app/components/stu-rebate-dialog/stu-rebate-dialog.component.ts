import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/interfaces';

//https://material.angular.io/components/dialog/overview
@Component({
  selector: 'app-stu-rebate-dialog',
  templateUrl: './stu-rebate-dialog.component.html',
  styleUrls: ['./stu-rebate-dialog.component.css']
})
export class StuRebateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StuRebateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('45%','80%')
  }

  onNoClick(): void{
    this.dialogRef.close()
  }

}
