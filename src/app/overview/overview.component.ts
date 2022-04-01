import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  messHistory:any;
  date = new Date();
  noOfDays:any;
  totalMeals:any;
  headers = ['Breakfast','Lunch','Snacks','Dinner','Milk','Egg']

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    this.totalMeals = {};
    for(let i=0;i<this.headers.length;i++){
      this.totalMeals[this.headers[i]] = 0;
    }
   }

  ngOnInit(): void {
  }

  cleanData(history:any){
    
    
    console.log(history)
    for(let j=0;j<this.noOfDays.length;j++){
      if(!(this.noOfDays[j] in history)){
        history[this.noOfDays[j]] = {}
      }
      let data = history[this.noOfDays[j]] 
      for(let i=0;i<this.headers.length;i++){
        if(data[this.headers[i]]){
          this.totalMeals[this.headers[i]] += data[this.headers[i]];
        }
      }

    }
    return history;
    
  }

  async getMonthMessData(data: any){
    
    if (data.form.value.year&&data.form.value.month) {
      let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
      this.noOfDays = Array(num).fill(1).map((x, i) => (i + 1).toString());
      this.service.getMonthlyMessdata(data.form.value.year,data.form.value.month).then((res)=>
      {
        let history = res;
        // console.log(res);
        this.messHistory = this.cleanData(history);
        console.log(this.messHistory)
      }).catch((res)=>{
        console.log(res)
        this.messHistory = this.cleanData({})
      });
    }else{
    }
  }

}
