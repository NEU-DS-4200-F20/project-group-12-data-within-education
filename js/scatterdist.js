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
      xValue = data => data.timeSpent,
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
            });

    
            // This part of the javascript is very experimental and most likely will be taken out for the next sprint
            // We spent a decent chunk of time putting this together, so we are deciding to keep it for now, but probably will move on
            // from this section in the future.
      var histogram = d3.bin()
            .value(function(d) { return d.timeSpent }) // Bin the timespent value
            .domain(xScale.domain())

      var xbin = histogram(data) //Actually apply the data to the binning function

      var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(xbin, function(d) { return d.length; })]); //Given the xbin bins, find the max length bin
      
      
      //We are creating a multi class histogram
      //Each histogram is filtered by the class name

      var bin1 = histogram(data.filter( function(d){return d.className === "HS ELA Saturday"} ));
      var bin2 = histogram(data.filter( function(d){return d.className === "STEM Enrichment Saturday"} ));
      var bin3 = histogram(data.filter( function(d){return d.className === "APUSH Enrichment Fall"} ));
      var bin4 = histogram(data.filter( function(d){return d.className === "HS ELA Sunday"} ));
      var bin5 = histogram(data.filter( function(d){return d.className === "Stem Enrichment Sunday"} ));
      

    //I will only go through the first histogram set up, as the rest are the same
    // I know there is a more efficient way of compressing these steps, but at this stage with limited time
    // I am not aware of how to use loops in this case

    //Each sequential histogram construction below has the respective bin (eg: bin1, bin2, bin3) as the data entry
      dist.selectAll("rect1")
      .data(bin1) //Give the data as bin1
      .enter().append("rect")
      .attr("x", function(d) {return xScale(d.x0)}) //Scale the starting piont of the bin (eg. 0, 10, etc)
      .attr("y", function(d) {return y(d.length)}) //Scale the length of the bin
      .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; }) //The width is the endpoint - starting point of the bin
      .attr("height", function(d) { return height - y(d.length); }) //The height is a function of the scaled length of the bin
      .style("fill",function(d) { //Color logic for the scatterplot points
        return colorScale("HS ELA Saturday")
        })
      .style("opacity", 0.08);
      
      dist.selectAll("rect2")
        .data(bin2)
        .enter().append("rect")
        .attr("x", function(d) {return xScale(d.x0)})
        .attr("y", function(d) {return y(d.length)})
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("STEM Enrichment Saturday")
          })
        .style("opacity", 0.08);

        dist.selectAll("rect3")
        .data(bin3)
        .enter().append("rect")
        .attr("x", function(d) {return xScale(d.x0)})
        .attr("y", function(d) {return y(d.length)})
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("APUSH Enrichment Fall")
          })
        .style("opacity", 0.08);

        dist.selectAll("rect4")
        .data(bin4)
        .enter().append("rect")
        .attr("x", function(d) {return xScale(d.x0)})
        .attr("y", function(d) {return y(d.length)})
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("HS ELA Sunday")
          })
        .style("opacity", 0.08);
      
      dist.selectAll("rect5")
        .data(bin5)
        .enter().append("rect")
        .attr("x", function(d) {return xScale(d.x0)})
        .attr("y", function(d) {return y(d.length)})
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("Stem Enrichment Sunday")
          })
        .style("opacity", 0.08);
        

        //Here we set up the second 

        var x2Scale = d3.scaleLinear() // Score is the x value
          .domain(d3.extent(data, yValue)) // Use extent to get the min, max
          .rangeRound([0, width]);


        var secondhistogram = d3.bin()
        .value(function(d){return (d.score/ d.totalPoints) * 100}) //Set the bin up based on the weighted score
        .domain(x2Scale.domain())

        var ybin = secondhistogram(data) //Actually apply the  data to the  secondhistogram function

        var y2 = d3.scaleLinear()
              .range([width, 0])
              .domain([0, d3.max(ybin, function(d) { return d.length; })]); //Find the max length of the general bin
    
    
    //I will only go through the first histogram set up, as the rest are the same
    // I know there is a more efficient way of compressing these steps, but at this stage with limited time
    // I am not aware of how to use loops in this case

    //Each sequential histogram construction below has the respective bin (eg: bin1, bin2, bin3) as the data entry
   

      var bin6 = secondhistogram(data.filter( function(d){return d.className === "HS ELA Saturday"} ));
      var bin7 = secondhistogram(data.filter( function(d){return d.className === "STEM Enrichment Saturday"} ));
      var bin8 = secondhistogram(data.filter( function(d){return d.className === "APUSH Enrichment Fall"} ));
      var bin9 = secondhistogram(data.filter( function(d){return d.className === "HS ELA Sunday"} ));
      var bin10 = secondhistogram(data.filter( function(d){return d.className === "Stem Enrichment Sunday"} ));

        
        seconddist.selectAll("rect6")
        .data(bin6) //Apply the data as according to the bin6 data
        .enter().append("rect")
        .attr("x", function(d) {return yScale(d.x1)}) //This time we scale based on the yScale for the end of the bin
        .attr("y", function(d) {return y2(d.length)}) //Scale the length of each bin
        .attr("width", function(d) { return yScale(d.x0) - yScale(d.x1) -1 ; }) //Subtract the starting point of bin by the endpoint of the bin
        .attr("height", function(d) { return width - y2(d.length); }) //The height is a function of the length
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("HS ELA Saturday")
          })
        .style("opacity", 0.08);

        seconddist.selectAll("rect7")
        .data(bin7)
        .enter().append("rect")
        .attr("x", function(d) {return yScale(d.x1)})
        .attr("y", function(d) {return y2(d.length)})
        .attr("width", function(d) { return yScale(d.x0) - yScale(d.x1) -1 ; })
        .attr("height", function(d) { return width - y2(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("STEM Enrichment Saturday")
          })
        .style("opacity", 0.08);

        seconddist.selectAll("rect8")
        .data(bin8)
        .enter().append("rect")
        .attr("x", function(d) {return yScale(d.x1)})
        .attr("y", function(d) {return y2(d.length)})
        .attr("width", function(d) { return yScale(d.x0) - yScale(d.x1) -1 ; })
        .attr("height", function(d) { return width - y2(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("APUSH Enrichment Fall")
          })
        .style("opacity", 0.08);

        seconddist.selectAll("rect9")
        .data(bin9)
        .enter().append("rect")
        .attr("x", function(d) {return yScale(d.x1)})
        .attr("y", function(d) {return y2(d.length)})
        .attr("width", function(d) { return yScale(d.x0) - yScale(d.x1) -1 ; })
        .attr("height", function(d) { return width - y2(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("HS ELA Sunday")
          })
        .style("opacity", 0.08);

        seconddist.selectAll("rect10")
        .data(bin10)
        .enter().append("rect")
        .attr("x", function(d) {return yScale(d.x1)})
        .attr("y", function(d) {return y2(d.length)})
        .attr("width", function(d) { return yScale(d.x0) - yScale(d.x1) -1 ; })
        .attr("height", function(d) { return width - y2(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("Stem Enrichment Sunday")
          })
        .style("opacity", 0.08);

      

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