import { Injectable } from '@angular/core';
declare let Plotly: any;

@Injectable({
  providedIn: 'root'
})
export class PlotlyService {

  constructor() { }
  plotLine(title: string, plotDiv: string, x:number[], y:number[]){           
    let trace = {
      x: x,    
      y: y,   
      type: 'scatter'   
    };
                  
    let layout = {
      title:title
    };
    const config = { responsive: true };
    Plotly.newPlot(plotDiv,[trace], layout,config)     
  }
  plotMess(title: string, plotDiv: string, x:string[], y1:number[],y2:number[]){
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
  plotMonthlyMess(title: string, plotDiv: string, day:string[], breakfast:number[],lunch:number[],snacks:number[],dinner:number[],milk:number[],egg:number[]){
    let trace = [
      {
        x: day,
        y: breakfast,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'red' },
        name:'Breakfast',
      },
      {
        x: day,
        y: lunch,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'green' },
        name:'Lunch',
      },
      {
        x: day,
        y: snacks,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'blue' },
        name:'Snacks',
      },
      {
        x: day,
        y: dinner,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'purple' },
        name:'Dinner',
      },
      {
        x: day,
        y: milk,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'orange' },
        name:'Milk',
      },
      {
        x: day,
        y: egg,
        type: 'scatter',
        mode: 'lines+markers',
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
