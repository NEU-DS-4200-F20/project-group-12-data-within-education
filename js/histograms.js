function histograms() {
    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 40
      },
      width = 240 - margin.left - margin.right,
      height = 240 - margin.top - margin.bottom,
      xValue = data => data.timespent,
      yValue = data => (data.score/ data.totalPoints) * 100,
      xLabelText = '',
      yLabelText = '',
      yLabelOffsetPx = 0,
      xScaleFirst = d3.scaleLinear(),
      xScaleSecond = d3.scaleLinear(),
      yScale = d3.scaleLinear()


      //https://www.d3-graph-gallery.com/graph/histogram_basic.html
      // Inspiration for any histograms

      function chart(selector, data) {

        data = data.filter(function(d){return d.assignType === "quiz" || d.assignType === "offline-quiz"} )
        //Time spent data is only available for quizzes and offline quiz
        let svg = d3.select(selector)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          




        let firstG = svg.append('g') //Need to add two group elements, one for each histogram
            .attr('transform', 'translate(' + (margin.left - 10) + ',' + 50 + ')')

        let secondG = svg.append('g')  //Need to add two group elements, one for each histogram
                .attr('transform', 'translate(' + (width + margin.left + margin.right - 10) + ',' + 50 + ')')
        
        let thirdG = svg.append('g')  //Need to add two group elements, one for each histogram
                .attr('transform', 'translate(' + (width * 2 + margin.left * 2) + ',' + 50 + ')')
        
        let fourthG = svg.append('g')  //Need to add two group elements, one for each histogram
                .attr('transform', 'translate(' + (width * 3 + margin.left * 2 + margin.right) + ',' + 50 + ')')
        
        let fifthG = svg.append('g')  //Need to add two group elements, one for each histogram
                .attr('transform', 'translate(' + (width * 4 + margin.left * 2 + margin.right * 2) + ',' + 50 + ')')

        let sixthG = svg.append('g') //Need to add two group elements, one for each histogram
        .attr('transform', 'translate(' + (margin.left - 10) + ',' + 350 + ')')
        
        let seventhG = svg.append('g')  //Need to add two group elements, one for each histogram
        .attr('transform', 'translate(' + (width + margin.left + margin.right - 10) + ',' + 350 + ')')
        let eigthG = svg.append('g')  //Need to add two group elements, one for each histogram
        .attr('transform', 'translate(' + (width * 2 + margin.left * 2) + ',' + 350 + ')')
        let ninthG = svg.append('g')  //Need to add two group elements, one for each histogram
        .attr('transform', 'translate(' + (width * 3 + margin.left * 2 + margin.right) + ',' + 350 + ')')
        let tenthG = svg.append('g')  //Need to add two group elements, one for each histogram
        .attr('transform', 'translate(' + (width * 4 + margin.left * 2 + margin.right * 2) + ',' + 350 + ')')
        
        
        xScaleFirst
          .domain(d3.extent(data, xValue)) // Domain is th extent of possible time spent values
          .rangeRound([0, width]);

        xScaleSecond
          .domain(d3.extent(data, yValue)) // Domain is the extent of possible grade values
          .rangeRound([0, width]);

          
        var firstHistogram = d3.bin()
          .value(function(d) { return d.timespent }) //Here we bin the timespent values
          .domain(xScaleFirst.domain())

        var secondHistogram = d3.bin()
          .value(function(d) { return (d.score/ d.totalPoints) * 100 }) // Here we bin the score values
        .domain(xScaleSecond.domain())

        var bins1 = firstHistogram(data) //Actually create the bins from the data
        var bins2 = secondHistogram(data) //Actually create the bins from the data
        console.log(bins2) 
    

        var x1 = d3.scaleLinear()
                .domain([0, d3.max(data, xValue)]) //XScale for histogram one     
                .range([0, width]);

        var x2 = d3.scaleLinear()
                .domain([0, d3.max(data, yValue)])   //XScale for histogram two   
                .range([0, width]);   

        
        firstG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1).ticks(5)); //Call the x axis into action

    

        secondG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1).ticks(5)); //Call the second xAxis into action



        thirdG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1).ticks(5)); //Call the second xAxis into action

        thirdG.append('text')        
                .attr('class', 'axisLabel')
                .attr('y', height + margin.bottom)
                .attr('fill', 'black')
                .attr('x', (width/2 - margin.left - margin.right/2))
                .style("font-size", "15px") 
                .text("Time Spent Distribution"); //Give the axis labels
        fourthG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1).ticks(5)); //Call the second xAxis into action

        fifthG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1).ticks(5)); //Call the second xAxis into action



        sixthG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x2)); //Call the second xAxis into action

        seventhG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x2)); //Call the second xAxis into action

        eigthG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x2)); //Call the second xAxis into action
        ninthG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x2)); //Call the second xAxis into action
        tenthG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x2)); //Call the second xAxis into action





        eigthG.append('text')        
                .attr('class', 'axisLabel')
                .attr('y', height + margin.bottom)
                .attr('fill', 'black')
                .attr('x', (width/2 - margin.left))
                .style("font-size", "15px") 
                .text("Grade Distribution"); //Give the axis labels


        var y1 = d3.scaleLinear()
            .range([height, 0]);
            y1.domain([0, d3.max(bins1, function(d) { return d.length; })]);   
        
        let yAxis = firstG.append("g")
            .call(d3.axisLeft(y1)); //Call the scaled yAxis and build it

        yAxis.append('text') //Only using one y axis label for both charts
            .attr('class', 'axisLabel')
            .attr('y', -25)
            .attr('fill', 'black') 
            .attr('x', -height/2)
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .style("font-size", "15px") 
            .text("Frequency");


     // d3.hist has to be called before the Y axis obviously
        secondG.append("g")
            .call(d3.axisLeft(y1)); //Call the second scaled yAxis and build it
        thirdG.append("g")
            .call(d3.axisLeft(y1));
        fourthG.append("g")
            .call(d3.axisLeft(y1));
        fifthG.append("g")
            .call(d3.axisLeft(y1));

        var y2 = d3.scaleLinear()
            .range([height, 0]);
            y2.domain([0, d3.max(bins2, function(d) { return d.length; })]);

        let yAxis2 = sixthG.append("g")
            .call(d3.axisLeft(y2)); //Call the scaled yAxis and build it
        yAxis2.append('text') //Only using one y axis label for both charts
            .attr('class', 'axisLabel')
            .attr('y', -25)
            .attr('fill', 'black') 
            .attr('x', -height/2)
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .style("font-size", "15px") 
            .text("Frequency");

    
        seventhG.append("g")
            .call(d3.axisLeft(y2)); //Call the second scaled yAxis and build it
        eigthG.append("g")
            .call(d3.axisLeft(y2)); //Call the second scaled yAxis and build it
        ninthG.append("g")
            .call(d3.axisLeft(y2)); //Call the second scaled yAxis and build it

        tenthG.append("g")
            .call(d3.axisLeft(y2)); //Call the second scaled yAxis and build it
   

        //Since we are making a stacked histogram chart, we bin each condition for both histograms
        var bin1 = firstHistogram(data.filter( function(d){return d.className === "HS ELA Saturday"} ));
        var bin2 = firstHistogram(data.filter( function(d){return d.className === "STEM Enrichment Saturday"} ));
        var bin3 = firstHistogram(data.filter( function(d){return d.className === "APUSH Enrichment Fall"} ));
        var bin4 = firstHistogram(data.filter( function(d){return d.className === "HS ELA Sunday"} ));
        var bin5 = firstHistogram(data.filter( function(d){return d.className === "Stem Enrichment Sunday"} ));

        var bin6 = secondHistogram(data.filter( function(d){return d.className === "HS ELA Saturday"} ));
        var bin7 = secondHistogram(data.filter( function(d){return d.className === "STEM Enrichment Saturday"} ));
        var bin8 = secondHistogram(data.filter( function(d){return d.className === "APUSH Enrichment Fall"} ));
        var bin9 = secondHistogram(data.filter( function(d){return d.className === "HS ELA Sunday"} ));
        var bin10 = secondHistogram(data.filter( function(d){return d.className === "Stem Enrichment Sunday"} ));
        
        

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
          .domain(data.map(function (d){ return d.className; })); //Color scale for the color and legend
        
        //Will only comment the first iteration, I understand that there is a more compressed way of going about this, but
        // I have no prior experience with JS and am not sure how to use looping in this case.
  
        firstG.selectAll("rect")
        .data(bin1) //The data is the filtered bin1
        .enter().append("rect")
        .attr("x", 1)
        .attr("x", function(d) {return x1(d.x0)}) //The starting point of each bin
        .attr("y", function(d) {return y1(d.length)}) //The length of each bin (frequency)
        .attr("width", function(d) { return x1(d.x1) - x1(d.x0) -1 ; }) //Formula for width subtract the starting endpoint of the bin
        .attr("height", function(d) { return height - y1(d.length); }) //The height is a function of the length of the bin
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("HS ELA Saturday") //The colors overlapping have not produced the best quality
          })
        
        secondG.selectAll("rect2")
          .data(bin2)
          .enter().append("rect")
          .attr("x", 1)
          .attr("x", function(d) {return x1(d.x0)})
          .attr("y", function(d) {return y1(d.length)})
          .attr("width", function(d) { return x1(d.x1) - x1(d.x0) -1 ; })
          .attr("height", function(d) { return height - y1(d.length); })
          .style("fill",function(d) { //Color logic for the scatterplot points
            return colorScale("STEM Enrichment Saturday")
            })
  
          thirdG.selectAll("rect3")
          .data(bin3)
          .enter().append("rect")
          .attr("x", 1)
          .attr("x", function(d) {return x1(d.x0)})
          .attr("y", function(d) {return y1(d.length)})
          .attr("width", function(d) { return x1(d.x1) - x1(d.x0) -1 ; })
          .attr("height", function(d) { return height - y1(d.length); })
          .style("fill",function(d) { //Color logic for the scatterplot points
            return colorScale("APUSH Enrichment Fall")
            })
  
          fourthG.selectAll("rect4")
          .data(bin4)
          .enter().append("rect")
          .attr("x", 1)
          .attr("x", function(d) {return x1(d.x0)})
          .attr("y", function(d) {return y1(d.length)})
          .attr("width", function(d) { return x1(d.x1) - x1(d.x0) -1 ; })
          .attr("height", function(d) { return height - y1(d.length); })
          .style("fill",function(d) { //Color logic for the scatterplot points
            return colorScale("HS ELA Sunday")
            })
        
        fifthG.selectAll("rect5")
          .data(bin5)
          .enter().append("rect")
          .attr("x", 1)
          .attr("x", function(d) {return x1(d.x0)})
          .attr("y", function(d) {return y1(d.length)})
          .attr("width", function(d) { return x1(d.x1) - x1(d.x0) -1 ; })
          .attr("height", function(d) { return height - y1(d.length); })
          .style("fill",function(d) { //Color logic for the scatterplot points
            return colorScale("Stem Enrichment Sunday")
            })


          sixthG.selectAll("rect6")
            .data(bin6)
            .enter().append("rect")
            .attr("x", 1)
            .attr("x", function(d) {return x2(d.x0)}) //Use x2 instead of x1
            .attr("y", function(d) {return y2(d.length)}) //Use y2 instead of y1
            .attr("width", function(d) { return x2(d.x1) - x2(d.x0) -1 ; })
            .attr("height", function(d) { return height - y2(d.length); })
            .style("fill",function(d) { //Color logic for the scatterplot points
                return colorScale("HS ELA Saturday")
              })
    
          seventhG.selectAll("rect7")
            .data(bin7)
            .enter().append("rect")
            .attr("x", 1)
            .attr("x", function(d) {return x2(d.x0)})
            .attr("y", function(d) {return y2(d.length)})
            .attr("width", function(d) { return x2(d.x1) - x2(d.x0) -1 ; })
            .attr("height", function(d) { return height - y2(d.length); })
            .style("fill",function(d) { //Color logic for the scatterplot points
              return colorScale("STEM Enrichment Saturday")
              })
    
          eigthG.selectAll("rect8")
            .data(bin8)
            .enter().append("rect")
            .attr("x", 1)
            .attr("x", function(d) {return x2(d.x0)})
            .attr("y", function(d) {return y2(d.length)})
            .attr("width", function(d) { return x2(d.x1) - x2(d.x0) -1 ; })
            .attr("height", function(d) { return height - y2(d.length); })
            .style("fill",function(d) { //Color logic for the scatterplot points
              return colorScale("APUSH Enrichment Fall")
              })
    
          ninthG.selectAll("rect9")
            .data(bin9)
            .enter().append("rect")
            .attr("x", 1)
            .attr("x", function(d) {return x2(d.x0)})
            .attr("y", function(d) {return y2(d.length)})
            .attr("width", function(d) { return x2(d.x1) - x2(d.x0) -1 ; })
            .attr("height", function(d) { return height - y2(d.length); })
            .style("fill",function(d) { //Color logic for the scatterplot points
              return colorScale("HS ELA Sunday")
              })
    
          tenthG.selectAll("rect10")
            .data(bin10)
            .enter().append("rect")
            .attr("x", 1)
            .attr("x", function(d) {return x2(d.x0)})
            .attr("y", function(d) {return y2(d.length)})
            .attr("width", function(d) { return x2(d.x1) - x2(d.x0) -1 ; })
            .attr("height", function(d) { return height - y2(d.length); })
            .style("fill",function(d) { //Color logic for the scatterplot points
              return colorScale("Stem Enrichment Sunday")
              })

          return chart;
        }
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

          chart.selectionDispatcher = function (_) {
            if (!arguments.length) return dispatcher;
            dispatcher = _;
            return chart;
          };
        
          // Given selected data from another visualization 
          // select the relevant elements here (linking)
          chart.updateSelection = function (selectedData) {
            if (!arguments.length) return;
        
            // Select an element if its datum was selected
            selectableElements.classed('selected', d =>
              selectedData.includes(d)
            );
          };
        
        

        return chart;
    };