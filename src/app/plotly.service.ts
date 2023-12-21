import { Injectable } from '@angular/core';
declare let Plotly: any;

@Injectable({
  providedIn: 'root'
})
export class PlotlyService {

  constructor() { }
  //example for scatter plot
  plotscatter(title: string, plotDiv: string, x:string[], y1:number[],y2:number[]){
    let trace = [
      {
        x: x,
        y: y1,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'red' },
        name:'Breakfast',
      },
      {
        x: x,
        y: y2,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'blue' },
        name:'Lunch',
      }
    ];
    
    const layout = {
      title: title,
      xaxis: {
        title: 'Date',
        type: 'date',
      },
      yaxis: {
        title: 'Meal taken',
      },
    };
    const config = { responsive: true };
    Plotly.newPlot(plotDiv,trace, layout,config)
  }
  //example for heatmap
  plotheatmap(title:string,plotdiv:string,x:number[][]){
    let data = [
      {
        z: [[1, null, 30, 50, 1], [20, 1, 60, 80, 30], [30, 60, 1, -10, 20]],       
        x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        y: ['Morning', 'Afternoon', 'Evening'],
        hoverongaps: false,
        type: 'heatmap',
      }
    ];
    Plotly.newPlot(plotdiv, data);

  }
  

  //for hostal statistics
  plotMonthlyMess(title: string, plotDiv: string, day:string[], breakfast:number[],lunch:number[],snacks:number[],dinner:number[],milk:number[],egg:number[]){
    let trace = [
      {
        x: day,
        y: breakfast,
        type: 'scatter',
        mode: 'lines+markers',
        hoverinfo:'none',
        marker: { color: 'red' },
        name:'Breakfast',
      },
      {
        x: day,
        y: lunch,
        type: 'scatter',
        mode: 'lines+markers',
        hoverinfo:'none',
        marker: { color: 'green' },
        name:'Lunch',
      },
      {
        x: day,
        y: snacks,
        type: 'scatter',
        mode: 'lines+markers',
        hoverinfo:'none',
        marker: { color: 'blue' },
        name:'Snacks',
      },
      {
        x: day,
        y: dinner,
        type: 'scatter',
        mode: 'lines+markers',
        hoverinfo:'none',
        marker: { color: 'purple' },
        name:'Dinner',
      },
      {
        x: day,
        y: milk,
        type: 'scatter',
        mode: 'lines+markers',
        hoverinfo:'none',
        marker: { color: 'orange' },
        name:'Milk',
      },
      {
        x: day,
        y: egg,
        type: 'scatter',
        mode: 'lines+markers',
        hoverinfo:'none',
        marker: { color: 'cyan' },
        name:'Egg',
      }
    ];
    
    const layout = {
      title: title,
      xaxis: {
        title: 'Date',
        type: 'date',
      },
      yaxis: {
        title: 'Meal taken',
      },
    };
    const config = { responsive: true };
    Plotly.newPlot(plotDiv,trace, layout,config)
  }
}
