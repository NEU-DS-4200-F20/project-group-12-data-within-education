/* global D3 */

// Initialize a scatterplot. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function scatterplot() {
    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 40
      },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      xValue = data => data.timespent,
      yValue = data => (data.score/ data.totalPoints) * 100,
      xLabelText = '',
      yLabelText = '',
      yLabelOffsetPx = 0,
      xScale = d3.scaleLinear(),
      yScale = d3.scaleLinear()

    
    // Below are the basic D3 principles applied to make a scatterplot
      
    function chart(selector, data) {
    
    //For timespent it is only applicable for quiz and offline quiz
    data = data.filter(function(d){return d.assignType === "quiz" || d.assignType === "offline-quiz"} )

    let svg = d3.select(selector)
        .append('svg')
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('viewBox', [0, 0, width + margin.left + margin.right, height *3].join(' '))
        

    //Title Text
      svg.append("text")
          .attr("x", (width / 2 + margin.right + margin.left))             
          .attr("y", 0 + (height/2))
          .attr("text-anchor", "middle")  
          .style("font-size", "20px") 
          .text("Grades by Time Spent"); 
    // Transition Text
    svg.append("text")
          .attr("x", (width / 2 + margin.right + margin.left))             
          .attr("y", 0 + (height*3 - margin.top - margin.bottom))
          .attr("text-anchor", "middle")  
          .style("font-size", "20px") 
          .text("Below are the reference distributions from the chart above");
    
    svg = svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top + margin.bottom) + ')');
    

    let legend = svg.append('g') 
          .attr('transform', 'translate(' + -width/1.1 + ',' + ((height - margin.bottom- margin.top)/2) + ')');
    
    //Setting up the sidescaling distributions
    let dist = svg.append('g')
    .attr('transform', 'translate(' + 0  + ',' + -(height + 10) + ')')
    
          
    // NOTE THE SECOND HISTOGRAM IS ROTATED 90 Degrees
    let seconddist = svg.append('g') 
    .attr('transform', 'translate(' + (width+height + margin.right) + ',' + 0 + ')' +  'rotate(90)')
          .attr('class', 'gRotate')
    

  
        xScale
          .domain(d3.extent(data, xValue)) // Use extent to get the min, max
          .rangeRound([0, width]);

        yScale
          .domain(d3.extent(data, yValue))
          .rangeRound([height, 0]);

    
        let xAxis = svg.append('g')
            .attr('transform', 'translate(0,' + (height) + ')')
            .call(d3.axisBottom(xScale));
            
        // X axis label
        xAxis.append('text')        
            .attr('class', 'axisLabel')
            .attr('y', 35)
            .attr('fill', 'black')
            .style("font-size", "15px") 
            .attr('x', (width) / 2)
            .text(xLabelText); //xLabelText is applied in the main visualization.js file

          
        let yAxis = svg.append('g')
            .call(d3.axisLeft(yScale))
            
        yAxis.append('text')
            .attr('class', 'axisLabel')
            .attr('y', -25)
            .attr('fill', 'black') 
            .attr('x', -height/2)
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .style("font-size", "15px") 
            .text(yLabelText);//yLabelText is applied in the main visualization.js file
    

      

          var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
          .domain(data.map(function (d){ return d.className; })); //ColorScheme set up based on class name


        svg.selectAll('circle').data(data)
            .enter().append('circle')
              .attr('cy', d => yScale(yValue(d))) //Scale the y datapoint 
              .attr('cx', d => xScale(xValue(d))) //Scale the x datapoint
              .attr('r', 4)
              .style("fill", function(d) { //Color logic for the scatterplot points
                return colorScale(d.className)
                });

    
    
        let statusMap = new Map();   // https://observablehq.com/@d3/d3v6-migration-guide
            data.forEach(d => {       // Using the migration guide to apply d3.Map in V6
            if (!statusMap.has(d.className)) statusMap.set(d.className, d);  // Add if not already present
            }); //StatusMap contians a map iterator with unique values of d.status and its entire data fields

        //https://www.d3-graph-gallery.com/graph/custom_legend.html inspiration for legend
        legend.selectAll("mydots")
            .data(statusMap.values()) //Insert the mapped values which we are concerned with, the status value will be distinct for each data object
            .enter()
            .append("circle")
              .attr("cx", margin.left - 30)
              .attr("cy", function(d,i){ return i*25}) // 100 is where the first dot appears. 25 is the distance between dots
              .attr("r", 5)
              .style("fill", function(d) {
                return colorScale(d.className)
                });
                
        legend.selectAll("mylabels")
            .data(statusMap.values()) //Insert the mapped values which we are concerned with, the status value will be distinct for each data object
            .enter()
            .append("text")
            .attr("x", margin.left - 20)
            .attr("y", function(d,i){ return i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .text(function(d){ return d.className})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("fill", function(d) { //Color logic for the scatterplot points
            console.log(d)
              return colorScale(d.className)
            })

      return chart;
    }
    

    // Below are the changeable chart elements based on the resuable model
    // Not all are being called on currently
    // The x-accessor from the datum
  
    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };
  
    chart.width = function (_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };
  
    chart.height = function (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };
  
    chart.x = function (_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };
  
    chart.y = function (_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };
  
    chart.xLabel = function (_) {
      if (!arguments.length) return xLabelText;
      xLabelText = _;
      return chart;
    };
  
    chart.yLabel = function (_) {
      if (!arguments.length) return yLabelText;
      yLabelText = _;
      return chart;
    };
  
    chart.yLabelOffset = function (_) {
      if (!arguments.length) return yLabelOffsetPx;
      yLabelOffsetPx = _;
      return chart;
    };
  
    return chart;
  }