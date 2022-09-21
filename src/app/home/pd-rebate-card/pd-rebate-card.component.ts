import { Component, Input, OnInit } from '@angular/core';
import { RebateRequest } from 'src/app/interfaces';

@Component({
  selector: 'app-pd-rebate-card',
  templateUrl: './pd-rebate-card.component.html',
  styleUrls: ['./pd-rebate-card.component.css']
})
export class PdRebateCardComponent implements OnInit {

  @Input() public rebate_request: RebateRequest;

  constructor() { }

  ngOnInit(): void {
  }

}
