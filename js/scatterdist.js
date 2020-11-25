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
        dispatcher;


    // Below are the basic D3 principles applied to make a scatterplot

    function chart(selector, data) {

        //For timespent it is only applicable for quiz and offline quiz
        data = data.filter(function(d){return d.assignType === "quiz" || d.assignType === "offline-quiz"} )

        let svg = d3.select(selector)
            .append('svg')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', [0, -50, width, height + 175].join(' '))

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

        let points = svg.append('g')
            .selectAll('.scatterPoint')
            .data(data);

        points.exit().remove();

        points = points
            .enter().append('circle')
            .attr('cy', d => yScale(yValue(d))) //Scale the y datapoint
            .attr('cx', d => xScale(xValue(d))) //Scale the x datapoint
            .attr('r', 4)
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
                console.log(d)
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
                points.classed('selected', d =>
                    x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1
                )

                // Get the name of our dispatcher's event
                let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
                // Let other charts know about our selection
                console.log(svg.selectAll('.selected'))
                dispatcher.call(dispatchString, this, svg.selectAll('.selected').data());
            }

            function brushEnd(event, d){
                // We don't want infinite recursion
                if(event.sourceEvent !== undefined && event.sourceEvent.type!='end'){
                    d3.select(this).call(brush.move, null);
                }
            }
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
        selectableElements.classed('selected', d =>
            selectedData.includes(d)
        );

    };

    return chart;
}