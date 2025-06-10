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

  plotHeatmap(title: string, div_identifier: string, x: string[], z: number[][], colors: string[], y: string[], maxCols: number = 7) {
    // Reshape data into grid with max 7 columns per row
    const reshapedZ = [];
    const reshapedLabels = [];
    const dateLabels = [];
    
    for (let mealIdx = 0; mealIdx < z.length; mealIdx++) {
      const mealData = z[mealIdx];
      const rowsNeeded = Math.ceil(mealData.length / maxCols);
      
      for (let rowNum = 0; rowNum < rowsNeeded; rowNum++) {
        const rowData = [];
        const rowDates = [];
        
        for (let col = 0; col < maxCols; col++) {
          const dataIdx = rowNum * maxCols + col;
          if (dataIdx < mealData.length) {
            rowData.push(mealData[dataIdx]);
            rowDates.push(x[dataIdx]);
          } else {
            rowData.push(null);  // Empty cell
            rowDates.push("");   // No date
          }
        }
        
        reshapedZ.push(rowData);
        dateLabels.push(rowDates);
        
        // Label rows with meal name + row number if multiple rows
        if (rowsNeeded === 1) {
          reshapedLabels.push(y[mealIdx]);
        } else {
          reshapedLabels.push(`${y[mealIdx]} (${rowNum + 1}/${rowsNeeded})`);
        }
      }
    }
    
    // Create color scale as before
    let num_colors = colors.length;
    let cs = [[0, 'rgb(225,225,225)'], [0.99/(num_colors+0.99), 'rgb(225,225,225)']];
    for (let i = 0; i < num_colors; i++) {
      cs.push([(i+0.99)/(num_colors+0.99), colors[i]]);
      cs.push([(i+1.99)/(num_colors+0.99), colors[i]]);
    }
    
    // Create the plot data
    const data = [{
      z: reshapedZ,
      type: 'heatmap',
      colorscale: cs,
      showscale: false,
      xgap: 1,
      ygap: 1,
      hoverinfo: 'text',
      text: dateLabels
    }];
    
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
    const totalWidth = maxCols * 40;
    const totalHeight = reshapedZ.length * 40;
    // Set up layout with custom labels
    const layout = {
      title: title,
      width: totalWidth + 100,
      height: totalHeight + 100,
      annotations: [] as Annotation[],
      xaxis: { showticklabels: false },
      yaxis: { tickvals: [], scaleanchor: 'x' }
    };
    
    // Add row labels
    for (let i = 0; i < reshapedLabels.length; i++) {
      layout.annotations.push({
        x: -0.1,
        y: i,
        xref: 'paper',
        yref: 'y',
        text: reshapedLabels[i],
        showarrow: false,
        font: { size: 15, color: "black", family: 'monospace', weight: 'bold', opacity: 1 }
      });
    }
    
    // Add date labels to cells
    let noOfRows = dateLabels.length;
    console.log("Datelabels:",dateLabels);
    for (let row = 0; row < dateLabels.length; row++) {
      for (let col = 0; col < dateLabels[row].length; col++) {
        if (dateLabels[row][col]) {
          layout.annotations.push({
            x: col,
            y: row,
            text: dateLabels[row][col],
            showarrow: false,
            font: { size: 10, color: "black", family: 'monospace', weight: 'bold', opacity: 1  },
            xref: 'x',
            yref: 'y'
          });
        }
      }
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
