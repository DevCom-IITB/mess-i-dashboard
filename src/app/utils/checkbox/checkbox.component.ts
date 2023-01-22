import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {

  @Input() public label:string;
  @Input() public inputModel: boolean;
  @Output() public inputModelChange = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  inputChange(event: any){
    // console.log(event)
    this.inputModelChange.emit(event);
  }

}
