import { Injectable } from '@angular/core';
declare let Plotly: any;

@Injectable({
  providedIn: 'root'
})
export class PlotlyService {

  COLORS = ['red', 'green', 'blue', 'purple', 'orange', 'cyan', 'magenta', 'yellow', 'black', 'gray', 'brown', 'pink'];

  constructor() { }

  plotMultiline(title: string, div_identifier: string, x: string[], y: number[][], labels: string[]){
    let trace = [];
    for(let i=0;i<y.length;i++){
      trace.push({
        x: x,
        y: y[i],
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'x',
        marker: { color: this.COLORS[i%this.COLORS.length] },
        name:labels[i],
        text:[]
      })
    }
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
    const config = { 
      responsive: true,
      scrollZoom: false, 
      displayModeBar: true,
      displaylogo : false,
      modeBarButtonsToRemove: [
        'zoom',
        'pan',
        'select',
        'zoomIn', 
        'zoomOut',
        'autoScale', 
        'resetScale'
      ],
    };
    Plotly.newPlot(div_identifier,trace, layout,config)
  }

  plotHeatmap(title: string, div_identifier: string, x: string[], z: number[][], colors: string[], y: string[]){
    let num_colors = colors.length;
    let cs = [[0, 'rgb(225,225,225)'], [0.99/(num_colors+0.99), 'rgb(225,225,225)']];
    for(let i=0;i<num_colors;i++){
      cs.push([(i+0.99)/(num_colors+0.99), colors[i]]);
      cs.push([(i+1.99)/(num_colors+0.99), colors[i]]);
    }
    let data = [
      {
        z: z,
        hoverongaps: true,
        hoverinfo:'x',
        type: 'heatmap',
        showscale: false,
        xgap: 1,
        ygap: 1,
        colorscale: cs
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
      xaxis: { },
      yaxis: {
        tickvals: [], // Remove y-axis tick values
        scaleanchor: 'x'
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
          size: 15,
          color:"black",
          family: 'monospace', // serif, sans-serif, monospace, Arial, Times New Roman, Courier New
          weight: 'bold',
          opacity: 1 
        }
      };
      layout.annotations.push(annotation);
    }
    const config = { 
      responsive: true,
      scrollZoom: false,
      displayModeBar: true,
      displaylogo : false,
      modeBarButtonsToRemove: [
        'zoom',
        'pan',
        'select',
        'zoomIn', 
        'zoomOut',
        'autoScale', 
        'resetScale',
      ],
    };
    Plotly.newPlot(div_identifier, data, layout,config);

  }
  plotPie(plotDiv:string, z:number[], _labels: string[], _colors: string[]){
    // for()
    var data = [{
      type: "pie",
      values: z,
      labels: _labels,
      textinfo: "label+value",
      // textposition: "outside",
      insidetextorientation: "horizontal",
      marker: { colors: _colors },
      hoverinfo:'none',
      automargin: true
    }]
    
    var layout = {
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false
    }
    const config = { 
      responsive: true,
      scrollZoom: false,
      displaylogo : false,
    };
    Plotly.newPlot(plotDiv, data, layout,config)
  }
}
