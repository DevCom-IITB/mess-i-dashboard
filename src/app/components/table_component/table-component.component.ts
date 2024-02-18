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

  getCSV(){
    let csv = this.data.headers.join(',');
    csv += '\n';
    this.data.body.forEach((row:any) => {
      csv += row.join(',');
      csv+= '\n';
    })
    if("footer" in this.data){
      csv += this.data.footer.join(',');
    }
    csv+= '\n';
    const anchor = document.createElement('a');
    anchor.href = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csv);
    anchor.target = '_blank';
    anchor.download = 'data.csv';
    anchor.click();
  }

}
