import { Injectable } from '@angular/core';
declare let Plotly: any;

@Injectable({
  providedIn: 'root'
})
export class PlotlyService {

  constructor() { }

  //for hostal statistics
  // TODO: Make this function more generic
  plotMonthlyMess(title: string, plotDiv: string, day:string[], breakfast:number[],lunch:number[],snacks:number[],dinner:number[],milk:number[],egg:number[]){
    let trace = [
      {
        x: day,
        y: breakfast,
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'none',
        marker: { color: 'red' },
        name:'Breakfast',
      },
      {
        x: day,
        y: lunch,
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'none',
        marker: { color: 'green' },
        name:'Lunch',
      },
      {
        x: day,
        y: snacks,
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'none',
        marker: { color: 'blue' },
        name:'Snacks',
      },
      {
        x: day,
        y: dinner,
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'none',
        marker: { color: 'purple' },
        name:'Dinner',
      },
      {
        x: day,
        y: milk,
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'none',
        marker: { color: 'orange' },
        name:'Milk',
      },
      {
        x: day,
        y: egg,
        type: 'scatter',
        mode: 'lines',
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
        showticklabels: false
      },
    };
    const config = { responsive: true };
    Plotly.newPlot(plotDiv,trace, layout,config)
  }

  plotStudentHeatmapData(title:string,plotdiv:string,z:number[][],x:string[]){
    let y=['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Milk', 'Egg']
    let data = [
      {
        z: z,
        hoverongaps: true,
        hoverinfo:'none',
        // colorscale: 'RdBu', //Magma, Viridis, Plasma, Jet, Cividis, RdBu
        type: 'heatmap',
        showscale: false,
        xgap: 2,
        ygap: 2,  
        colorscale: [
          [0, 'rgb(219, 217, 217)'],   
          [1, 'rgb(171, 212, 70)']      
        ]
      }
    ];
    interface Annotation {
      x: number;
      y: number;
      xref: string;
      yref: string;
      text: string;
      showarrow: boolean;
      font: {
        size: number;
        color: string; 
        family: string; 
        weight: string; 
        opacity: number;
      };
    }
    const layout = {
      title: title,
      annotations:[] as Annotation[],
      xaxis: {
        // tickvals: Array.from({ length: data[0].z[0].length }, (_, i) => i + 1),
        // ticktext: Array.from({ length: data[0].z[0].length }, (_, i) => (i + 1).toString()),
        // range:[1,data[0].z[0].length],
        // autorange: false
      },
      yaxis: {
        tickvals: [], // Remove y-axis tick values
      }
    };
    for (let i = 0; i < data[0].z.length; i++) {
      const annotation = {
        x: 0.5, // X-coordinate at the center of the heatmap
        y: i,
        xref: 'paper',
        yref: 'y',
        text: y[i], // Row label text
        showarrow: false,
        font: {
          size: 20,
          color:"#4a4a4a",
          family: 'monospace', // serif, sans-serif, monospace, Arial, Times New Roman, Courier New
          weight: 'bold',
          opacity: 1 
        }
      };
      layout.annotations.push(annotation);
    }
    Plotly.newPlot(plotdiv, data, layout);

  }

  plotStudentPieData(plotDiv:string, z:number[]){
    // for()
    var data = [{
      type: "pie",
      values: z,
      labels: ["Breakfast", "Lunch", "Snacks", "Dinner", "Milk", "Egg"],
      textinfo: "label+value",
      // textposition: "outside",
      insidetextorientation: 'horizontal',
      hoverinfo:'none',
      automargin: true
    }]
    
    var layout = {
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false
      }
    
    Plotly.newPlot(plotDiv, data, layout)
  }
}
