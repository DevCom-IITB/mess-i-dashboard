import { Component, Input, OnInit } from '@angular/core';
import { RebateRequest } from 'src/app/interfaces';

@Component({
  selector: 'app-rebate-card',
  templateUrl: './rebate-card.component.html',
  styleUrls: ['./rebate-card.component.css']
})
export class RebateCardComponent implements OnInit {

  @Input() public rebate_request: RebateRequest;

  public p_request_recieved: string;
  public p_rebate_start: string;
  public p_rebate_end: string;

  private numToMonth: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor() { }

  ngOnInit(): void {
    let rr = this.rebate_request.recieve_date;
    this.p_request_recieved = `${rr.toLocaleDateString()}, ${rr.toTimeString().slice(0,8)}`;
    this.p_rebate_start = this.readableDate(this.rebate_request.rebate_duration_start);
    this.p_rebate_end = this.readableDate(this.rebate_request.rebate_duration_end);
  }

  readableDate(inp: Date): string{
    return `${inp.getDate()} ${this.numToMonth[inp.getMonth()]} ${inp.getFullYear()}`;
  }

}
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-rebate-card',
//   templateUrl: './rebate-card.component.html',
//   styleUrls: ['./rebate-card.component.css']
// })
// export class RebateCardComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
