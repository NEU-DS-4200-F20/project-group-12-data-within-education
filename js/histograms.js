function histograms() {
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
      xScaleFirst = d3.scaleLinear(),
      xScaleSecond = d3.scaleLinear(),
      yScale = d3.scaleLinear()

      function chart(selector, data) {

        data = data.filter(function(d){return d.assignType === "quiz" || d.assignType === "offline-quiz"} )

        let svg = d3.select(selector)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('viewBox', [0, 0, (width + margin.left + margin.right + margin.right), height *1.3].join(' '))


        svg.append("text")
          .attr("x", (width / 2 + margin.right + margin.left))             
          .attr("y", 0 + (margin.top/2))
          .attr("text-anchor", "middle")  
          .style("font-size", "30px") 
          .text("Reference Distribution Plots");

        let firstG = svg.append('g') 
            .attr('transform', 'translate(' + -(width/2) + ',' + 50 + ')')
                .attr('class', 'gRotate')

        let secondG = svg.append('g') 
                .attr('transform', 'translate(' + (width/2 + margin.right + margin.left) + ',' + 50 + ')')
                    .attr('class', 'gRotate')
     
        
        xScaleFirst
          .domain(d3.extent(data, xValue)) // Use extent to get the min, max
          .rangeRound([0, width]);

        xScaleSecond
            .domain(d3.extent(data, yValue)) // Use extent to get the min, max
          .rangeRound([0, width]);

          
        var firstHistogram = d3.bin()
          .value(function(d) { return d.timeSpent })
          .domain(xScaleFirst.domain())

        var secondHistogram = d3.bin()
            .value(function(d) { return (d.score/ d.totalPoints) * 100 })
          .domain(xScaleSecond.domain())

        var bins1 = firstHistogram(data)
           
        var bins2 = secondHistogram(data)
        console.log(bins2)           

        var x1 = d3.scaleLinear()
                .domain([0, d3.max(data, xValue)])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
                .range([0, width]);
        var x2 = d3.scaleLinear()
                .domain([0, d3.max(data, yValue)])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
                .range([0, width]);    
        firstG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1));

        firstG.append('text')        
                .attr('class', 'axisLabel')
                .attr('y', height + margin.bottom)
                .attr('fill', 'black')
                .attr('x', (width/2 - margin.right - margin.left))
                .text("Time Spent Distribution");

        secondG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x2));
        secondG.append('text')        
                .attr('class', 'axisLabel')
                .attr('y', height + margin.bottom)
                .attr('fill', 'black')
                .attr('x', (width/2 - margin.right - margin.left))
                .text("Grade Distribution");


        var y1 = d3.scaleLinear()
            .range([height, 0]);
            y1.domain([0, d3.max(bins1, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        let yAxis = firstG.append("g")
            .call(d3.axisLeft(y1));

        yAxis.append('text')
            .attr('class', 'axisLabel')
            .attr('y', -25)
            .attr('fill', 'black') 
            .attr('x', -height/2)
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text("Frequency");

        var y2 = d3.scaleLinear()
            .range([height, 0]);
            y2.domain([0, d3.max(bins2, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        secondG.append("g")
            .call(d3.axisLeft(y2));

        console.log(y2.domain())
        
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
        
        console.log(bin6)

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
          .domain(data.map(function (d){ return d.className; }));
        
  
  
        firstG.selectAll("rect")
        .data(bin1)
        .enter().append("rect")
        .attr("x", 1)
        .attr("x", function(d) {return x1(d.x0)})
        .attr("y", function(d) {return y1(d.length)})
        .attr("width", function(d) { return x1(d.x1) - x1(d.x0) -1 ; })
        .attr("height", function(d) { return height - y1(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
          return colorScale("HS ELA Saturday")
          })
        .style("opacity", 0.08);
        
        firstG.selectAll("rect2")
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
          .style("opacity", 0.08);
  
          firstG.selectAll("rect3")
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
          .style("opacity", 0.08);
  
          firstG.selectAll("rect4")
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
          .style("opacity", 0.08);
        
        firstG.selectAll("rect5")
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
          .style("opacity", 0.08);

        secondG.selectAll("rect6")
        .data(bin6)
        .enter().append("rect")
        .attr("x", 1)
        .attr("x", function(d) {return x2(d.x0)})
        .attr("y", function(d) {return y2(d.length)})
        .attr("width", function(d) { return x2(d.x1) - x2(d.x0) -1 ; })
        .attr("height", function(d) { return height - y2(d.length); })
        .style("fill",function(d) { //Color logic for the scatterplot points
            return colorScale("HS ELA Saturday")
          })
        .style("opacity", 0.08);

        secondG.selectAll("rect7")
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
        .style("opacity", 0.08);

        secondG.selectAll("rect8")
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
        .style("opacity", 0.08);

        secondG.selectAll("rect9")
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
        .style("opacity", 0.08);

        secondG.selectAll("rect10")
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
        .style("opacity", 0.08);

          return chart;
        }

        return chart;
    };