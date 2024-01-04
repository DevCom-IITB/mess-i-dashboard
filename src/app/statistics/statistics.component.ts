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
  hostelmessHistory:any;
  studentmessHistory:any;
  noOfDays:any;
  noOfDays2:any;
  date = new Date();
  headers = ['Day','Breakfast','Lunch','Snacks','Dinner','Milk','Egg','Fruit']


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
      console.log(res)
    })
  }
  orgHostelData(history:any){
    if(this.noOfDays.length == 0) return [];
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

  async plotData(data: any){
    this.plotHostelData(data);
    this.plotStudentData(data);
  }
  async plotHostelData(data: any){
    if (data.form.value.year&&data.form.value.month) {
      let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
      this.noOfDays = Array(num).fill(1).map((x,i) => (i + 1).toString());
      this.noOfDays2 = Array(num).fill(`${data.form.value.year}-${data.form.value.month}-${1}`).map((x,i) => (`${data.form.value.year}-${data.form.value.month}-${i+1}`));
      this.service.getHostelStats(data.form.value.hostel,data.form.value.year,data.form.value.month).then((res)=>
      {
        let history = res;
        this.hostelmessHistory = this.orgHostelData(history);
        this.plot.plotMonthlyMess("Mess Stats","mess_data",this.noOfDays2,this.hostelmessHistory.get('Breakfast')!,this.hostelmessHistory.get('Lunch')!,this.hostelmessHistory.get('Snacks')!,this.hostelmessHistory.get('Dinner')!,this.hostelmessHistory.get('Milk')!,this.hostelmessHistory.get('Egg')!);
      }).catch((res)=>{
        console.log(res)
        this.hostelmessHistory = this.orgHostelData({})
      });
    }
  }

  orgStudentData(history:any,noOfDays:string[]){
    let mp = new Map<string,number[]>([
      ['Breakfast',[]],['Lunch',[]],['Snacks',[]],['Dinner',[]],['Milk',[]],['Egg',[]],
    ])
    if(noOfDays.length == 0) return [];
    for(let j=0;j<noOfDays.length;j++){
      if(!(noOfDays[j]in history)){
        for(let key of mp.keys()) {
          mp.get(key)!.push(0);
        }
      }else{
        for(let key of mp.keys()) {
          if(key in history[noOfDays[j]]){
            mp.get(key)!.push(1);
          }else{
            mp.get(key)!.push(0);
          }
        }
      }
    }
    
    return mp;
    
  }

  async plotStudentData(data: any){    
    if (data.form.value.year&&data.form.value.month) {
      let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
      let noOfDays = Array(num).fill(1).map((x,i) => (i + 1).toString());
      this.service.getStudentStats(this.roll_selectable ? data.form.value.roll : this.auth.roll_no,data.form.value.year,data.form.value.month).then((res)=>
      {
        let history = res;
        this.studentmessHistory = this.orgStudentData(history, noOfDays);
        let data: number[][] = Array.from(this.studentmessHistory.values() as Iterable<number[]>).map((value) => [...value]);
        let sums: number[] = data.map((subarray) => subarray.reduce((acc, value) => acc + value, 0));
        this.plot.plotStudentHeatmapData("Student Stats","student_data",data,noOfDays);
        this.plot.plotStudentPieData("pie", sums)
      }).catch((res)=>{
        console.log(res)
        this.studentmessHistory = this.orgStudentData({},[])
      });
    }
  }

}
