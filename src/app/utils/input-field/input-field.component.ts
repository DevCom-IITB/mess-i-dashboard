import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

  @Input() public label:string;
  @Input() public bgColor?: string = "#ffffff";
  // @Input() public calender?: boolean = false;
  @Input() public text_to_show : string = "None";
  @Input() public inputType: string = "text";
  @Input() public inputModel?: string;
  @Input() callbackFunction: (args: any) => void;
  @Output() public inputModelChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  inputChange(event: any){
    // console.log(event)
    this.inputModelChange.emit(event);
  }

  emitFile(event:any){
    // console.log((event.target.files[0].size)/(10^6))
    console.log(event.target.files[0].size)
    console.log(event.target.files[0].size < 20*(1000000))
    if (event.target.files[0].type == "application/pdf"){
      if(event.target.files[0].size < 20*(1000000)){
        this.callbackFunction(event)
      }else{
        alert("file size should be less than 20MB")
      }
    }else{
      alert('choose pdf only')
    }

  }


}
