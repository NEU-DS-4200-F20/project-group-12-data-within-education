function multilinechart() {
    const margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 35
    }
    const width = 500 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

function chart(selector, data) {

    const line = d3.line()
        .defined(d => !isNaN(d))
        .x((d, i) => x(data.dates[i]))
        .y(d => y(d))

    const x = d3.scaleUtc()
        .domain(d3.extent(data.dates))
        .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
        .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
        .range([height - margin.bottom, margin.top])

    const colorsScale = d3.scaleOrdinal()
        .domain(data.series.map(d => d.name))
        .range(['rgb(234,118,47)', 'rgb(56,106,197)'])

    const legend = d3.legendColor()
        .shapeWidth(20)
        // .orient('horizontal')
        .scale(colorsScale)

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        // .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.utcFormat("%Y-%m-%d")))
        .call(g => g.selectAll("g.tick text")
            .attr("transform", `rotate(45) translate(40, 0)`))

    const svg = d3.select(selector).append("svg")
    .attr('preserveAspectRatio', 'xMidYMid meet')
        .style("overflow", "visible")
        .attr('viewBox', [0, 0, (width + margin.left + margin.right), height * 2].join(' '))
        
    svg.append("text")
        .attr("x", -(margin.left))             
        .attr("y", 0 + (width/2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text("Student Grades");    


    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(legend);

    const path = svg.append("g")
        .attr("fill", "none")
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

return chart;
};