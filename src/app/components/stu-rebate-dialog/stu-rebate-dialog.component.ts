import { Component, Inject, OnInit } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData} from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';

//https://material.angular.io/components/dialog/overview
@Component({
  selector: 'app-stu-rebate-dialog',
  templateUrl: './stu-rebate-dialog.component.html',
  styleUrls: ['./stu-rebate-dialog.component.css']
})
export class StuRebateDialogComponent implements OnInit {
  includeCSV:boolean = true;
  data : DialogData
  constructor(
    public dialogRef: MatDialogRef<StuRebateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public injected_data: any,
    private data_service : StudentdataService 
  ) {
    console.log(this.injected_data['includeCSV'])
    if(this.injected_data['includeCSV'] != undefined){
    this.includeCSV = this.injected_data['includeCSV']
    }
   }

  getRebates = () => this.data_service.getAdminRebatesRoll(this.injected_data['roll'])

  ngOnInit(): void {
    this.dialogRef.updateSize('65%','80%')
  }

  onNoClick(): void{
    this.dialogRef.close()
  }

}
