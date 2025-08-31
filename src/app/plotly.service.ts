import { sanitizeIdentifier } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { tick } from '@angular/core/testing';
import { MatDateRangeInput } from '@angular/material/datepicker';
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
      //width: 1000,
      autosize: true,
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

  plotHeatmap(title: string, div_identifier: string, x: string[], z: number[][], colors: string[], y: string[], month:string, year:string, mealId: number = 4, maxCols: number = 7) {
    // the input month is taken as 1-indexed, so we need to convert it to 0-indexed for Date object
    // Sort dates chronologically
    const firstDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const startDay = firstDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday. This is also the number of days of padding squares before the start of the month


    const dateMap = x.map((date, index) => ({date, index}))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
    const sortedX = dateMap.map(item => item.date);
    const sortedZ = z.map(mealRow => dateMap.map(item => mealRow[item.index]));
    sortedX.unshift(...Array(startDay-1).fill("")); // Add empty strings for padding at the start. The -1 is to show heatmap like its starting from monday and not from sunday
    sortedZ.forEach(mealRow => mealRow.unshift(...Array(startDay-1).fill(0))); // Add zeros for padding at the start. The -1 is to show heatmap like its starting from monday and not from sunday
    
    // Now use sortedX and sortedZ instead of x and z
    // Rest of the function remains the same but use sortedX and sortedZ
    console.log(sortedZ);
    // Reshape data into grid with max 7 columns per row
    const reshapedZ = [];
    const dateLabels = [];
    
    for (let mealIdx = 0; mealIdx < sortedZ.length; mealIdx++) {
      const mealData = sortedZ[mealIdx];
      const rowsNeeded = Math.ceil(mealData.length / maxCols);
      
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
        
        for (let col = 0; col < maxCols; col++) {
          const dataIdx = rowNum * maxCols + col;
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
        
        // Label rows with meal name + row number if multiple rows
        // if (rowsNeeded === 1) {
        //   reshapedLabels.push(y[mealIdx]);
        // } else {
        //   reshapedLabels.push(`${y[mealIdx]} (${rowNum + 1}/${rowsNeeded})`);
        // }
      }
    }
    // Create color scale as before

    let screen_width = window.innerWidth;
    let bg_color = 'rgba(40, 39, 43, 1)';
    let text_color = 'rgb(255, 206, 93)';
    let heatmap_color = 'rgba(255, 255, 255, 1)'
    if (screen_width >= 431) {
      bg_color = 'rgba(255, 252, 244, 1)';
      text_color = 'black';
      heatmap_color = 'rgba(225, 225, 225, 1)';
    }

    let num_colors = colors.length;
    let cs = [[0, heatmap_color], [0.99/(num_colors+0.99), 'rgb(225,225,225)']];
    for (let i = 0; i < num_colors; i++) {
      cs.push([(i+0.99)/(num_colors+0.99), colors[i]]);
      cs.push([(i+1.99)/(num_colors+0.99), colors[i]]);
    }
    let reversed_reshapedZ = reshapedZ.reverse();
    let reversed_dateLabels = dateLabels.reverse();
    // Create the plot data
    // I reversed the array beacuse..., dont reverse the array and see how it is applied and you will know why
    const data = [{
      z: reversed_reshapedZ.slice(5*mealId, 5*mealId+5),
      type: 'heatmap',
      colorscale: cs,
      showscale: false,
      xgap: 1,
      ygap: 1,
      hoverinfo: 'text',
      text: reversed_dateLabels.slice(5*mealId, 5*mealId+5)
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
    const totalWidth = maxCols * 45;
    const totalHeight = reshapedZ.length * 9;

    // Set up layout with custom labels
    const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const layout = {
      title:{
        text: "Meal Calendar",
        font: {
          size: 20,
          color: text_color,
          family: 'Open Sans',
          weight: 'bold',
          opacity: 1
        }
      },
      // width: totalWidth + 80,
      //width : screen_width >= 431 ? totalWidth + 80 : 330,
      autosize:true,
      height: totalHeight + 80,
      margin: { t: 70, b: 10, l: 10, r: 10 },
      annotations: [] as Annotation[],
      xaxis: {
        showticklabels: true,
        tickvals: Array.from({ length: maxCols }, (_, i) => i),
        ticktext: weekdayLabels.splice(0, maxCols),
        tickfont: {
          color: "rgb(255, 206, 93)",
          size: 14,
          family: 'Open Sans',
        },
        side: 'top',
        showline: false,
        zeroline: false
      },
      yaxis: {
        tickvals: [],
        scaleanchor: 'x',
        showline: false,
        zeroline: false
      },
      paper_bgcolor: bg_color,
      plot_bgcolor: bg_color,
    };
    
    // Add row labels
    // let reversed_reshapedLabels = reshapedLabels.reverse();
    // for (let i = 0; i < reshapedLabels.length; i++) {
    //   layout.annotations.push({
    //     x: -0.1,
    //     y: i,
    //     xref: 'paper',
    //     yref: 'y',
    //     text: reversed_reshapedLabels[i],
    //     showarrow: false,
    //     font: { size: 15, color: "black", family: 'monospace', weight: 'bold', opacity: 1 }
    //   });
    // }
    
    // Add date labels to cells
    for (let row = 0; row < dateLabels.length/5; row++) {
      for (let col = 0; col < dateLabels[row].length; col++) {
        if (dateLabels[row][col]) {
          layout.annotations.push({
            x: col,
            y: row,
            text: dateLabels[row][col],
            showarrow: false,
            font: { size: 12, color: "black", family: 'Open Sans', weight: '500', opacity: 1  },
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
    let screen_width = window.innerWidth;
    let bg_color = 'rgba(40, 39, 43, 1)';
    let text_color = 'rgb(128, 128, 128)';
    if (screen_width >= 431) {
      bg_color = 'rgba(255, 252, 244, 1)';
      text_color = 'black';
    }

    var data = [{
      title: {
        text: "Meal Utilization",
        font: {
          size: 20,
          color: text_color,
          family: 'Open Sans',
          weight: 'bold',
          opacity: 1
        }
      },
      type: "pie",
      values: z,
      labels: _labels,
      textinfo: "label+value",
      textfont: {
        family: 'Open Sans',
        color: text_color
      },
      insidetextorientation: "horizontal",
      marker: { colors: _colors },
      hoverinfo:'none',
      automargin: false,
    }]
    
    var layout = {
      height: screen_width >= 431 ? 400 : 310,
      width: screen_width >= 431 ? 400 : 310,
      margin: {"t": 50, "b": 20, "l": 20, "r": 20}, 
      showlegend: false,
      paper_bgcolor: bg_color,
      plot_bgcolor: bg_color,
      autosize: false 
    }
    
    const config = { 
      responsive: false,
      scrollZoom: false,
      displaylogo: false,
      displayModeBar: false, 
      staticPlot: true 
    };
    
    Plotly.react(plotDiv, data, layout, config);
  }
}
