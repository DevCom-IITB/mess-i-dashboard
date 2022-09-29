import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

  @Input() public label:string;
  @Input() public bgColor?: string = "#ffffff";

  constructor() { }

  ngOnInit(): void {
  }

}
