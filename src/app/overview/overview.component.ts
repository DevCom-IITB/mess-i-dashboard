import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  hostel_selectable: boolean = false;
  roll_selectable: boolean = false;
  hostelmessHistory:any = {exists:true, loaded:false};
  allowedHostels: boolean[] = new Array<boolean>(22);
  messHistory:any;
  noOfDays:any;
  date = new Date();
  headers = ['Day','Breakfast','Lunch','Snacks','Dinner','Milk','Egg','Fruit']

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
   }

  ngOnInit(): void {
    this.getAdminHostel()
    this.hostel_selectable = this.roll_selectable = this.auth.isAdmin();
  }

  getAdminHostel(){
    this.service.getAdminHostels().then((res: any) => {
      for(let i = 1; i < this.allowedHostels.length; i++) {
        this.allowedHostels[i] = false;
        if(res.includes(`H${i}`)) {
          this.allowedHostels[i] = true;
        }
        if(res.includes("TANSA")) {
          this.allowedHostels[21] = true;
        }
      }
    }).catch((res) => {
      console.log(res);
      this.hostelmessHistory = { exists: false, loaded: true };
    });
  }
  

  cleanData(history:any){
    let body = [];
    let foot = [0,0,0,0,0,0,0];
    for(let j=0;j<this.noOfDays.length;j++){
      if(!(this.noOfDays[j] in history)){
        body.push([this.noOfDays[j],'-','-','-','-','-','-','-'])
      }else{
        let day = [this.noOfDays[j]];
        for(let k=1;k<this.headers.length;k++){
          if(this.headers[k] in history[this.noOfDays[j]]){
            day.push(history[this.noOfDays[j]][this.headers[k]]);
            foot[k-1]+=history[this.noOfDays[j]][this.headers[k]];
          }else{
            day.push('-');
          }
        }
        body.push(day);
      }
    }
    let footer = ["Total"];
    for(let i=0;i<foot.length;i++){
      footer.push(foot[i].toString());
    }
    let res = {headers:this.headers,body:body,footer:footer}
    return res;
    
  }

  async getMonthMessData(data: any){
   
    
    if (data.form.value.year&&data.form.value.month) {
      let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
      this.noOfDays = Array(num).fill(1).map((x, i) => (i + 1).toString());
      this.service.getMonthlyMessdata(data.form.value.hostel,data.form.value.year,data.form.value.month).then((res)=>
      {
        let history = res;
        this.messHistory = this.cleanData(history);
       
      }).catch((res)=>{
        console.log(res)
        this.messHistory = this.cleanData({})
      });
    }else{
    }
  }

}
