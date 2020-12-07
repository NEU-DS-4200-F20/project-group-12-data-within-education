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
        yScale = d3.scaleLinear(),
        ourBrush = null,
        selectableElements = d3.select(null),
        dispatcher,
        idleTimeout,
        idleDelay = 350;

    // Below are the basic D3 principles applied to make a scatterplot

    function chart(selector, data) {

        var clicks = 0


        //For timespent it is only applicable for quiz and offline quiz
        data = data.filter(function(d){return d.assignType === "quiz" || d.assignType === "offline-quiz"} )

        let svg = d3.select(selector)
            .append('svg')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', [0, -50, width, height + 175].join(' '))
            .on("dblclick", function (){
                dispatcher.call('selectionUpdated', this, data)
            })
            .on("mousedown", function (){
                dispatcher.call('resetTable', this, svg.selectAll('.selected').data())
            })
            .on("click", function(){ //Need in case of triple click errors
                clicks ++ // Add to click variable
                setTimeout(function(){ //Set a timer to allow a short period of time for a double click
                  if (clicks >= 3){
                    dispatcher.call('selectionUpdated', this, data) // Once clicks is equal to two within the 250 MS, call to listen for the dispatch event labeled changeColor2
                    clicks = 0 // Resets click back to zero once the 250 MS runs up
                  }
                  clicks = 0 // Resets click back to zero once the 250 MS runs up
                }, 1000) // 250 MS time to get two clicks
              })
              
              // https://bl.ocks.org/mthh/e9ebf74e8c8098e67ca0a582b30b0bf0
            
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width )
            .attr("height", height )
            

        //Title Text
        svg.append("text")
            .attr("x", (450 / 2))
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "21px")
            .text("Quiz Grades by Time Spent");

        svg = svg.append('g')
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')');


        let legend = svg.append('g')
            .attr('transform', 'translate(' + 0 + ',' + 450 + ')');

        xScale
            .domain(d3.extent(data, xValue)) // Use extent to get the min, max
            .rangeRound([0, width]);

        yScale
            .domain(d3.extent(data, yValue))
            .rangeRound([height, 0]);


        let xAxis = svg.append('g')
            .attr('transform', 'translate(0,' + (height) + ')')
            .attr('id', "axis--x")
            .call(d3.axisBottom(xScale));

        // X axis label
        xAxis.append('text')
            .attr('class', 'axisLabel')
            .attr('y', 35)
            .attr('fill', 'black')
            .style("font-size", "10px")
            .attr('x', (width) / 2)
            .text(xLabelText); //xLabelText is applied in the main visualization.js file


        let yAxis = svg.append('g')
            .attr('id', "axis--y")
            .call(d3.axisLeft(yScale))

        yAxis.append('text')
            .attr('class', 'axisLabel')
            .attr('y', -40)
            .attr('fill', 'black')
            .attr('x', -height/2)
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .style("font-size", "10px")
            .text(yLabelText);//yLabelText is applied in the main visualization.js file

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(function (d){ return d.className; })); //ColorScheme set up based on class name

    

        let points = svg.append('g')
            .attr("id", "points")
            .attr("clip-path", "url(#clip)")
            
            

        points.selectAll('.scatterPoint')
            .data(data)
            .enter().append('circle')
            .attr('cy', d => yScale(yValue(d))) //Scale the y datapoint
            .attr('cx', d => xScale(xValue(d))) //Scale the x datapoint
            .attr('r', 4)
            .attr('stroke-width', 1.1)
            .style("stroke", function(d) { //Color logic for the scatterplot points
                return colorScale(d.className)
            })
        
            

           
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
            .attr("cy", function(d,i){ return i*15}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 3)
            .style("stroke", function(d) {
                return colorScale(d.className)
            });

        legend.selectAll("mylabels")
            .data(statusMap.values()) //Insert the mapped values which we are concerned with, the status value will be distinct for each data object
            .enter()
            .append("text")
            .attr("x", margin.left - 20)
            .attr("y", function(d,i){ return i*15}) // 100 is where the first dot appears. 25 is the distance between dots
            .text(function(d){ return d.className})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "12px")
            .style("fill", function(d) { //Color logic for the scatterplot points
                return colorScale(d.className)
            })


        selectableElements = points;
        svg.call(brush);
        

        // Highlight points when brushed
        function brush(g) {
            const brush = d3.brush() // Create a 2D interactive brush
                .on('start brush', highlight) // When the brush starts/continues do...
                .on('end', brushEnd) // When the brush ends do...
                .extent([
                    [-margin.left, -margin.bottom],
                    [width + margin.right, height + margin.top]
                ]);

            ourBrush = brush;

            g.call(brush); // Adds the brush to this element

            // Highlight the selected circles
            function highlight(event, d) {
                if (event.selection === null) return;
                const [
                    [x0, y0],
                    [x1, y1]
                ] = event.selection;

                // If within the bounds of the brush, select it
                points.selectAll("circle").attr('class', function(d){
                    if (x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1)
                    return "selected"
                    else
                    return "normal"
                }
                )                
            }

            function brushEnd(event, d){
                var s = event.selection
                if (!s) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                    xScale.domain(d3.extent(data, xValue)).nice();
                    yScale.domain(d3.extent(data, yValue)).nice();
                } else {
                    xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xScale));
                    yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yScale));
                    d3.select(this).call(brush.move, null);
                }

                zoom();
                dispatcher.call('selectionUpdated', this, svg.selectAll('.selected').data());
            }
        }

        function idled() {
            idleTimeout = null;
        }

        function zoom() {
            svg.select("#axis--x").transition().call(d3.axisBottom(xScale));
            svg.select("#axis--y").transition().call(d3.axisLeft(yScale));
            points.selectAll("circle").transition().duration(800)
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
        }
 
        return chart;
    }
    // Below are the changeable chart elements based on the resuable model
    // Not all are being called on currently
    // The x-accessor from the datum

    function X(d) {
        return xScale(xValue(d));
    }

    // The y-accessor from the datum
    function Y(d) {
        return yScale(yValue(d));
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
        selectableElements.selectAll("circle").attr('class', function(d){
            if (selectedData.includes(d))
            return "selected"
            else
            return "nonselected"
        }
        )
    };

    return chart;
}