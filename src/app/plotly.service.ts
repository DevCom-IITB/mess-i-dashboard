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
    let initialTrace = [];
    let y_max = 0;
    for(let i=0;i<y.length;i++){
      y_max = Math.max(y_max, Math.max(...y[i]));
    }
    for(let i=0;i<y.length;i++){
      trace.push({
        x: x,
        y: y[i],
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'x+y',
        marker: { color: this.COLORS[i%this.COLORS.length] },
        name:labels[i],
        text:[]
      });
      initialTrace.push({
        x: x,
        y: y[0],
        type: 'scatter',
        mode: 'lines',
        hoverinfo:'x',
        marker: { color: this.COLORS[i%this.COLORS.length] },
        name:labels[i],
        text:[]
      });
    }
    let screen_width = window.innerWidth;
    let bg_color = 'rgba(40, 39, 43, 1)';
    let text_color = 'rgba(255, 255, 255, 0.5)';
    if (screen_width >= 431) {
      bg_color = 'rgba(255, 255, 255, 1)';
      text_color = 'black';
    }
    const layout = {
      width: 1000,
      // title: title,
      paper_bgcolor: bg_color,
      plot_bgcolor: bg_color,
      xaxis: {
        title: {
          text: 'Date',
          font: {
            color: text_color,
            size: 20
          },
        },
        type: 'date',
        tickfont: {
          color: text_color,
        },
        gridcolor: 'rgba(255, 255, 255, 0.1)',
      },
      yaxis: {
        title: {
          text: 'Meal taken',
          font: {
            color: text_color,
            size: 20
          }
        },
        showticklabels: true,
        tickfont: {
          color: text_color,
        },
        gridcolor: 'rgba(255, 255, 255, 0.1)',
        range: [0, y_max *1.3],
      },
      legend: {
        orientation: 'h',
        yanchor: 'top',
        y: 1.1,
        xanchor: 'center',
        x: 0.5,
        traceorder: 'normal',
        itemwidth: 10,
        tracegroupgap: 5,
        font: {            
          size: 10,
          color: text_color,
        }
      },
      
      margin: {
        t: 10
      }
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
    Plotly.newPlot(div_identifier,initialTrace, layout,config);
    Plotly.animate(div_identifier, 
    { data: trace },
    {
      transition: { duration: 500, easing: 'easeOutExpo' },
      frame: { duration: 500 }
    }
    );
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
