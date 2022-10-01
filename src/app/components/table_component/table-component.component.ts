import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css']
})
export class TableComponentComponent implements OnInit {

  @Input() data:any;
  // Data should be passed in this format, an object with 
  // headers: list
  // body: list of lists

  constructor() { }

  ngOnInit(): void {
  }

}
