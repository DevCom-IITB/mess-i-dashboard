import { Component, NgModule, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { StudentdataService } from 'src/app/studentdata.service';
StudentdataService

@Component({
  selector: 'app-form-mess-bill',
  templateUrl: './form-mess-bill.component.html',
  styleUrls: ['./form-mess-bill.component.css']
})
export class FormMessBillComponent implements OnInit {
  @Input() form_structure:any;
  autofill: any;
  form_data:number[] = new Array(31);

  constructor(private data_service: StudentdataService) { 
    this.autofill = 0;
  }

  ngOnInit(): void {
    // console.log(this.form_structure)
    for (let index = 0; index < this.form_structure.numOfDays; index++) {
      this.form_data[index] = 0
      // console.log(this.form_data[index])
    }

  }

  

  async doAutoFill(element : any){
    // console.log(element.target.id)
    element.target.value = this.autofill; 
    this.form_data[element.target.id - 1] = this.autofill
  }

  clean_data(data:any){
    // console.log(this.form_data)
    // let prices:{} = dict(); 
    // let prices = new Map();
    let prices: {[id:string]:string}={};
    // prices = {}

    for(let i = 0; i < this.form_structure.numOfDays; i++){
      // const str = String(i+1)
      prices[String(i+1)] = String(this.form_data[i])
      // prices.set((i+1).toString(), this.form_data[i])
      // prices[] = this.form_data[i]
    }

    // let final_data = new Map();
    let final_data: {[id:string]:string|{[id:string]:string}}={};
    final_data['month'] = this.form_structure.month
    final_data['price_data'] = prices

    return JSON.stringify(final_data)
  }

  async postData(data:any){
    // console.log(JSON.parse(this.clean_data(data)))
    this.data_service.putMessPrices(this.clean_data(data))
  }

  async updateAutoFill(element :any){
    this.autofill = element.target.value;
  }

  range(i:number){
    // console.log(Array.from(Array(i).keys()))
    return Array.from(Array(i).keys())
  }

}
