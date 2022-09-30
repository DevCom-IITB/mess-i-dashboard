import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-studentcard',
  templateUrl: './studentcard.component.html',
  styleUrls: ['./studentcard.component.css']
})
export class StudentcardComponent implements OnInit {
 
  datatable = {
    headers:['breakfast','lunch','dinner'],
    body:[['10:00',"13:20","20:05"],
    ['10:00',"13:20","20:05"],
    ['10:00',"13:20","20:05"]],
    footer:['10',"130","25"]
  }

  constructor() { }

  ngOnInit(): void {
  }


}
