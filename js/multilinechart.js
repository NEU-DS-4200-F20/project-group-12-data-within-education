function multilinechart() {
    const margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 80
    }
    const width = 500 - margin.left - margin.right
    const height = 500 - margin.top
    let line, x, y, colorsScale, legend, pathG, nameText, svg, yAxisG, xAxisG, legendG, yAxis, xAxis

    function chart(selector, data) {

        line = d3.line()
            .defined(d => !isNaN(d))
            .x((d, i) => x(data.dates[i]))
            .y(d => y(d))

        x = d3.scaleUtc()
            .domain(d3.extent(data.dates))
            .range([margin.left, width - margin.right])

        y = d3.scaleLinear()
            .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
            .range([height - margin.bottom, margin.top])

        colorsScale = d3.scaleOrdinal()
            .domain(data.series.map(d => d.name))
            .range(d3.schemeCategory10)

        legend = d3.legendColor()
            .shapeWidth(10)
            // .orient('horizontal')
            .scale(colorsScale)

        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            // .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y))

        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.utcFormat("%Y-%m-%d")))
            .call(g => g.selectAll("g.tick text")
                .attr("transform", `rotate(45) translate(40, 0)`))

        svg = d3.select(selector).append("svg")
            // .attr('preserveAspectRatio', 'xMidYMid meet')
            // .style("overflow", "visible")
            // .attr('width', '50%')
            .attr('style', 'width: 100%')
            .attr('height', height)
        // .attr('viewBox', [0, 0, (width + margin.left + margin.right), height].join(' '))

        nameText = svg.append("text") //XAxis text
            .attr("x", ((width / 2)))
            .attr("y", margin.top - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .text(`Student ${data.name} Grades`);
        svg.append("text") //Title Text
            .attr("x", (width / 2))
            .attr("y", 0 + (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Grades Recieved By A Student");

        xAxisG = svg.append("g")
            .call(xAxis);

        yAxisG = svg.append("g")
            .call(yAxis);

        legendG = svg.append("g")
            .attr("transform", "translate(" + width + ',' + height / 2 + ")")
            .call(legend);

        pathG = svg.append("g")

        pathG.attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data.series)
            .join("path")
            .attr("stroke", d => colorsScale(d.name))
            .style("mix-blend-mode", "multiply")
            .attr("d", d => line(d.values));

        return chart;
    }

    chart.update = function (data) {
        pathG.selectAll('path').remove()
        xAxisG.remove()
        yAxisG.remove()
        legendG.remove()
        nameText.remove()
        line = d3.line()
            .defined(d => !isNaN(d))
            .x((d, i) => x(data.dates[i]))
            .y(d => y(d))

        x = d3.scaleUtc()
            .domain(d3.extent(data.dates))
            .range([margin.left, width - margin.right])

        y = d3.scaleLinear()
            .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
            .range([height - margin.bottom, margin.top])

        colorsScale = d3.scaleOrdinal()
            .domain(data.series.map(d => d.name))
            .range(d3.schemeCategory10)

        legend = d3.legendColor()
            .shapeWidth(10)
            // .orient('horizontal')
            .scale(colorsScale)
        xAxisG = svg.append("g")
            .call(xAxis);

        yAxisG = svg.append("g")
            .call(yAxis);

        legendG = svg.append("g")
            .attr("transform", "translate(" + width + ',' + height / 2 + ")")
            .call(legend);

        nameText = svg.append("text") //XAxis text
            .attr("x", ((width / 2)))
            .attr("y", margin.top - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .text(`Student ${data.name} Grades`);
        pathG.attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data.series)
            .join("path")
            .attr("stroke", d => colorsScale(d.name))
            .style("mix-blend-mode", "multiply")
            .attr("d", d => line(d.values));
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


    return chart;
};