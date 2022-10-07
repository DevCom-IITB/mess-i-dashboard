import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

  @Input() public label:string;
  @Input() public bgColor?: string = "#ffffff";
  @Input() public calender?: boolean = false;
  @Input() public inputModel?: string;
  @Output() public inputModelChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  inputChange(event: any){
    this.inputModelChange.emit(event);
  }


}
