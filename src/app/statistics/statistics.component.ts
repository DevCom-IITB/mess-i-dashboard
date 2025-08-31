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
  data_copy:any;
  selectedMonth: number;
  selectedYear: number;
  app_bar_suffix: string = "Statistics";
  date = new Date();
  headers = ['Day','Breakfast','Lunch','Snacks','Dinner','Milk','Egg','Fruit'];
  MEALS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Milk', 'Egg', 'Fruit'];
  //COLORS = ['#fc5095', '#fc9a50', '#cefc50', '#fce250', '#87fc50', '#fc5350', '#50fca9'];
  // COLORS_RGB = ['rgb(251, 80, 148)', 'rgb(253, 155, 84)', 'rgb(206, 252, 81)', 'rgb(252, 226, 81)', 'rgb(135, 252, 80)', 'rgb(252, 83, 80)', 'rgb(80, 252, 169)'];

  COLORS_RGB = [  
  'rgb(244, 211, 94)',   
  'rgb(250, 240, 202)',  
  'rgb(238, 150, 75)',   
  'rgb(249, 87, 56)',    
  'rgb(255, 196, 43)'
];
  public on_admin_page:boolean ;
  private adminRoutes: string[] = ["/statistics"];
  dates: string[][];
  heatmapValues: number[][];
  heatmapMeal: number = 0;
  messHistory: any = {exists:true, loaded:false};


  constructor(private plot:PlotlyService,private service:StudentdataService,private auth:AuthService, private router:Router) { 
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }
  ngOnInit(): void {
    this.getAdminHostel();
    this.hostel_selectable = this.roll_selectable = this.auth.isAdmin();
    // this.hostel_selectable = this.roll_selectable = true;
    this.on_admin_page = this.adminRoutes.some(sub => this.router.url.startsWith(sub));
    // this.on_admin_page = true;
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
      heatmapz: Array.from(mp.values() as Iterable<number[]>).map(arr => [0].concat(arr)),
      colors: this.COLORS_RGB,
      exists: true,
      loaded: true
    };


    return res;
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

  async plotData(data: any) {
    // Setup
    this.data_copy = data;
    let num = new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
    this.noOfDays = Array(num).fill(1).map((x, i) => (i + 1).toString());
    this.noOfDays2 = Array(num).fill(1).map((x, i) => (`${data.form.value.year}-${data.form.value.month}-${i+1}`));
    
    this.service.getMonthlyMessdata(data.form.value.hostel,data.form.value.year,data.form.value.month).then((res)=>
      {
        let history = res;
        this.messHistory = this.cleanData(history);
       
      }).catch((res)=>{
        console.log(res)
        this.messHistory = this.cleanData({})
      });

    this.hostelmessHistory = {exists: true, loaded: false};
    this.studentmessHistory = {exists: true, loaded: false};
    this.selectedMonth = parseInt(data.form.value.month);
    this.selectedYear = parseInt(data.form.value.year);
    try {
      // Wait for hostel data first
      await this.plotHostelData(data);
      // Only then proceed with student data
      await this.plotStudentData(data);
    } catch (error) {
      console.error("Error plotting data:", error);
    }
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

  genStudentPlotData(history: any) {
    let orged_data = this.dictifyStudentData(history);
    
    if (Array.from(orged_data.keys() as Iterable<any>).length == 0) {
      return {exists: false, loaded: true};
    }
    
    let hz = Array.from(orged_data.values() as Iterable<number[]>);
    let sms = hz.map((subarray) => subarray.reduce((acc, value) => acc + (value > 0 ? 1 : 0), 0));
    let nzidx = sms.map((value, index) => (value > 0 ? index : -1)).filter((value) => value >= 0);
    
    // Check if hostelmessHistory is available and initialized
    if (!this.hostelmessHistory || !this.hostelmessHistory.meal_counts || !this.hostelmessHistory.labels) {
      console.error("hostelmessHistory not fully initialized");
      return {exists: false, loaded: true, error: "Hostel data not loaded"};
    }
    
    // Safe utilization calculation
    let utilization = sms.map((value, index) => {
      if (!this.hostelmessHistory.meal_counts[index]) return '-';
      let sum = this.hostelmessHistory.meal_counts[index];
      return (sum > 0 ? value/sum : '-');
    });
    
    let res = {
      heatmapz: nzidx.map((value) => [0].concat(hz[value])),
      sums: nzidx.map((value) => sms[value]),
      meals: nzidx.map((value) => this.hostelmessHistory.labels[value] || `Meal ${value}`),
      colors: nzidx.map((value) => this.COLORS_RGB[value] || this.COLORS_RGB[0]),
      util: nzidx.map((value) => utilization[value]),
      available_meals: nzidx.map((value) => this.hostelmessHistory.meal_counts[value] || 0),
      exists: true,
      loaded: true
    };
    return res;
  }

  async plotHostelData(data: any){
    if (data.form.value.year&&data.form.value.month) {
      await this.service.getHostelStats(data.form.value.hostel,data.form.value.year,data.form.value.month).then((res)=>{
        this.hostelmessHistory = this.genHostelPlotData(res);
        console.log(this.hostelmessHistory);
        this.plot.plotMultiline("Hostel Statistics", "mess_data", this.hostelmessHistory.x, this.hostelmessHistory.y, this.hostelmessHistory.labels);
        // this.plot.plotHeatmap("Hostel Meal Distribution", "hostel_heatmap", this.noOfDays, this.hostelmessHistory.heatmapz, this.hostelmessHistory.colors, this.hostelmessHistory.labels);
      }).catch((res)=>{
        console.log(res)
        this.hostelmessHistory = {exists:false, loaded:true};
      });
    }
  }

  async plotStudentData(data: any){    
  if (data.form.value.year && data.form.value.month) {
    this.service.getStudentStats(
      this.roll_selectable ? data.form.value.roll : this.auth.roll_no,
      data.form.value.year,
      data.form.value.month
    ).then((res) => {
      this.studentmessHistory = this.genStudentPlotData(res);

      // this.plot.plotHeatmap("Student Stats","student_data",this.noOfDays,this.studentmessHistory.heatmapz, ['#ffce5d'], this.studentmessHistory.meals, data.form.value.month, data.form.value.year);
      this.plot.plotPie("pie", this.studentmessHistory.sums, this.studentmessHistory.meals, this.studentmessHistory.colors);

      const firstDate = new Date(parseInt(data.form.value.year), parseInt(data.form.value.month) - 1, 1);
      const startDay = firstDate.getDay();

      const dateMap = this.noOfDays.map((date: string, index: number) => ({date, index}))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
      const sortedX = dateMap.map((item: any) => item.date);
      const sortedZ = this.studentmessHistory.heatmapz.map((mealRow: any) => dateMap.map((item: any) => mealRow[item.index]));

      const padLength = Math.max(0, startDay - 1);
      if (padLength > 0) {
        sortedX.unshift(...Array(padLength).fill(""));
        sortedZ.forEach((mealRow: any) => mealRow.unshift(...Array(padLength).fill(0)));
      }

      this.reshapeData(sortedX, sortedZ, 0);

      let calendarElement = document.getElementById('meal-calendar');
      if (calendarElement) {
        calendarElement.style.display = "block";
      }

    }).catch((res) => {
      console.log("Error in getStudentStats:", res);
      this.studentmessHistory = {exists:false, loaded:true};
    });
  }
}

  updateHeatMap(meal: number) {
    // Update the heatmap based on the selected meal
    if (this.studentmessHistory.exists && this.studentmessHistory.loaded) {
      // this.plot.plotHeatmap("Student Stats","student_data",this.noOfDays,this.studentmessHistory.heatmapz, ['#ffce5d'], this.studentmessHistory.meals, this.data_copy.form.value.month, this.data_copy.form.value.year, meal);
      this.heatmapMeal = meal;
    }
  }

  async showHeatMapButtons() {
    const buttons = document.getElementById("myTab");
    if (buttons) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if(this.studentmessHistory.exists){
        buttons.style.display = "flex";
      }
      else if (!this.studentmessHistory.exists){
        buttons.style.display = "none";
      }
    }
  }
  isStudentPage() {
    return this.auth.isStudent() && !this.on_admin_page;
  }

  reshapeData(sortedX: string[], sortedZ: number[][], mealId: number): void {
    const reshapedZ = [];
    const dateLabels = [];
    
    for (let mealIdx = 0; mealIdx < sortedZ.length; mealIdx++) {
      const mealData = sortedZ[mealIdx];
      const rowsNeeded = Math.ceil(mealData.length / 7);
      
      for (let rowNum = 0; rowNum < rowsNeeded; rowNum++) {
        const rowData = [];
        const rowDates = [];

        // let pad = 0;
        // if (reshapedZ.length === 0 && dateLabels.length === 0) {
        //   pad = startDay;
        //   for(let i = 0; i < pad; i++) {
        //     rowData.push(0);
        //     rowDates.push("");
        // }
        // }
        
        for (let col = 0; col < 7; col++) {
          const dataIdx = rowNum * 7 + col;
          if (dataIdx < mealData.length) {
            rowData.push(mealData[dataIdx]);
            rowDates.push(sortedX[dataIdx]);
          } else {
            rowData.push(0);  // Empty cell
            rowDates.push("");   // No date
          }
        }
        
        reshapedZ.push(rowData);
        dateLabels.push(rowDates);
        
      }
    }
    this.dates = dateLabels; // Remove the last row if it is empty
    this.heatmapValues = reshapedZ
  

    console.log("testing dates", this.dates);
    console.log("testing heatmapValues", this.heatmapValues);
  }
}
