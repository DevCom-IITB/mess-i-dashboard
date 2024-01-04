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
  hostel_selectable: boolean = false;
  roll_selectable: boolean = false;
  allowedHostels:boolean[] = new Array<boolean>(22);
  hostelmessHistory:any = {exists:true, loaded:false};
  studentmessHistory:any = {exists:true, loaded:false};
  noOfDays:any;
  noOfDays2:any;
  date = new Date();
  headers = ['Day','Breakfast','Lunch','Snacks','Dinner','Milk','Egg','Fruit']
  
  MEALS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Milk', 'Egg', 'Fruit'];
  COLORS = ['#fc5095', '#fc9a50', '#cefc50', '#fce250', '#87fc50', '#fc5350', '#50fca9'];
  COLORS_RGB = ['rgb(252, 80, 149)', 'rgb(252, 154, 80)', 'rgb(206, 252, 80)', 'rgb(252, 226, 80)', 'rgb(135, 252, 80)', 'rgb(252, 83, 80)', 'rgb(80, 252, 169)']



  constructor(private plot:PlotlyService,private service:StudentdataService,private auth:AuthService, private router:Router) { 
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }
  ngOnInit(): void {
    this.getAdminHostel();
    this.hostel_selectable = this.roll_selectable = this.auth.isAdmin();
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
      console.log(res);
      this.hostelmessHistory = {exists:false, loaded:true};
    })
  }

  genHostelPlotData(history: any){
    if(this.noOfDays.length == 0) return {exists:false, loaded:true};
    let mp = new Map<string, number[]>(this.MEALS.map((meal, index) => [meal, []] as [string, number[]]));
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
    let res = {
      x: this.noOfDays2,
      y: Array.from(mp.values() as Iterable<number[]>),
      labels: Array.from(mp.keys() as Iterable<string>),
      meal_counts: Array.from(mp.values() as Iterable<number[]>).map((subarray) => subarray.reduce((acc, value) => acc + (value>0 ? 1 : 0), 0)),
      exists: true,
      loaded: true
    };


    return res;
  }

  async plotData(data: any){
    let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
    this.noOfDays = Array(num).fill(1).map((x,i) => (i + 1).toString());
    this.noOfDays2 = Array(num).fill(1).map((x,i) => (`${data.form.value.year}-${data.form.value.month}-${i+1}`));

    await this.plotHostelData(data);
    await this.plotStudentData(data);
  }


  dictifyStudentData(history:any){
    let mp = new Map<string, number[]>(this.MEALS.map((meal, index) => [meal, []] as [string, number[]]));
    let meal_idx = new Map<string, number>(this.MEALS.map((meal, index) => [meal, index] as [string, number]));
    if(this.noOfDays.length == 0) return [];
    for(let j=0;j<this.noOfDays.length;j++){
      if(!(this.noOfDays[j]in history)){ // No meal for the day
        for(let key of mp.keys()) {
          mp.get(key)!.push(0);
        }
      }else{
        for(let key of mp.keys()) { // At least one meal in the day
          if(key in history[this.noOfDays[j]]){
            mp.get(key)!.push(meal_idx.get(key)! + 1);
          }else{
            mp.get(key)!.push(0);
          }
        }
      }
    }
    
    return mp;
  }

  genStudentPlotData(history: any){
    let orged_data = this.dictifyStudentData(history);
    if(Array.from(orged_data.keys() as Iterable<any>).length == 0) return {exists:false, loaded:true};
    let hz = Array.from(orged_data.values() as Iterable<number[]>);let sms = hz.map((subarray) => subarray.reduce((acc,value) => acc+(value>0?1:0), 0));
    let nzidx = sms.map((value, index) => (value>0?index:-1)).filter((value) => value>=0);
    let utilization = sms.map((value, index) => {let sum = this.hostelmessHistory.meal_counts[index];return (sum>0?value/sum:'-');});

    let res = {
      heatmapz: nzidx.map((value) => [0].concat(hz[value])),
      sums: nzidx.map((value) => sms[value]),
      meals: nzidx.map((value) => this.hostelmessHistory.labels[value]),
      colors: nzidx.map((value) => this.COLORS_RGB[value]),
      util: nzidx.map((value) => utilization[value]),
      available_meals: nzidx.map((value) => this.hostelmessHistory.meal_counts[value]),
      exists: true,
      loaded: true
    };
    return res;
  }

  async plotHostelData(data: any){
    if (data.form.value.year&&data.form.value.month) {
      await this.service.getHostelStats(data.form.value.hostel,data.form.value.year,data.form.value.month).then((res)=>{
        this.hostelmessHistory = this.genHostelPlotData(res);
        this.plot.plotMultiline("Hostel Statistics", "mess_data", this.hostelmessHistory.x, this.hostelmessHistory.y, this.hostelmessHistory.labels);
      }).catch((res)=>{
        console.log(res)
        this.hostelmessHistory = {exists:false, loaded:true};
      });
    }
  }

  async plotStudentData(data: any){    
    if (data.form.value.year&&data.form.value.month) {
      this.service.getStudentStats(this.roll_selectable ? data.form.value.roll : this.auth.roll_no,data.form.value.year,data.form.value.month).then((res)=>
      {
        this.studentmessHistory = this.genStudentPlotData(res);
        this.plot.plotHeatmap("Student Stats","student_data",this.noOfDays,this.studentmessHistory.heatmapz, this.studentmessHistory.colors, this.studentmessHistory.meals);
        this.plot.plotPie("pie", this.studentmessHistory.sums, this.studentmessHistory.meals, this.studentmessHistory.colors);
      }).catch((res)=>{
        console.log(res)
        this.studentmessHistory = {exists:false, loaded:true};
      });
    }
  }

}
