import { Component, OnInit } from '@angular/core';
import { PlotlyService } from '../plotly.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  allowedHostels:boolean[] = new Array<boolean>(22);
  messHistory:any;
  noOfDays:any;
  noOfDays2:any;
  date = new Date();


  constructor(private plot:PlotlyService,private service:StudentdataService,private auth:AuthService, private router:Router) { 
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }
  ngOnInit(): void {
    this.getAdminHostel()
    //rough data check
    let x2:string[]= ['2013-10-04', '2013-10-20', '2013-11-04','2013-11-20', '2013-12-04', '2013-12-20'];
    let y2:number[]= [1,4,2,5,7,3];
    let y21:number[]= [2, 4, 1,8,2,5];
    let z = [[1, 20, 30], [20, 1, 60], [30, 60, 1]]
    this.plot.plotscatter("scatter","scatter",x2,y2,y21);
    this.plot.plotheatmap("heatmap","heatmap_curve",z)
  }

  getAdminHostel(){
    this.service.getAdminHostels().then((res:any)=>{
      for(let i=1; i<this.allowedHostels.length; i++){
        this.allowedHostels[i] = false;
        if(res.includes(`H${i}`)){
          this.allowedHostels[i] = true;
        }
        if(res.includes("TANSA")){
          this.allowedHostels[21] = true;
        }
      }
    }).catch((res) =>{
      console.log(res)
    })
  }
  cleanData(history:any){
    let mp = new Map<string,number[]>([
      ['Breakfast',[]],['Lunch',[]],['Snacks',[]],['Dinner',[]],['Milk',[]],['Egg',[]],
    ])
    for(let j=0;j<this.noOfDays.length;j++){
      if(!(this.noOfDays[j]in history)){
        for(let key of mp.keys()) {
          mp.get(key)!.push(0);
        }
      }else{
        for(let key of mp.keys()) {
          if(key in history[this.noOfDays[j]]){
            mp.get(key)!.push(history[this.noOfDays[j]][key]);
          }else{
            mp.get(key)!.push(0);
          }
        }
      }
    }
    let res = mp;
    return res;
    
  }

  async getMonthMessData(data: any){
    
    if (data.form.value.year&&data.form.value.month) {
      let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
      this.noOfDays = Array(num).fill(1).map((x,i) => (i + 1).toString());
      this.noOfDays2 = Array(num).fill(`${data.form.value.year}-${data.form.value.month}-${1}`).map((x,i) => (`${data.form.value.year}-${data.form.value.month}-${i+1}`));
      this.service.getMonthlyMessdata(data.form.value.hostel,data.form.value.year,data.form.value.month).then((res)=>
      {
        let history = res;
        this.messHistory = this.cleanData(history);
        console.log(this.messHistory.get('Breakfast'))
        this.plot.plotMonthlyMess("Mess State","plot3",this.noOfDays2,this.messHistory.get('Breakfast')!,this.messHistory.get('Lunch')!,this.messHistory.get('Snacks')!,this.messHistory.get('Dinner')!,this.messHistory.get('Milk')!,this.messHistory.get('Egg')!);
      }).catch((res)=>{
        console.log(res)
        this.messHistory = this.cleanData({})
      });
    }else{
    }
  }

}
