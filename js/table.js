/* global D3 */

// Initialize a table Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 20
  },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  let table, selector


  function chart(select, data) {
    selector = select
    // Please note: We tried adjusting the style for the table here, but with no luck
    // All style changes including width, height, translate, and more were done within the styles.cc
    // for the table-holder div. That was the only workaround we found with David Saffo during OH
    // Because it is a HTML table and our limited knowledge, we were unsure how to make the table responsive to screen size changes
    table = d3.select(selector)
      .append('table')

    //Create table features
    // https://bost.ocks.org/mike/chart/ ideas from here

    var columns = Object.keys(data[0]) // the data keys of the json

    let thead = table.append('thead') //start off table head
    let tbody = table.append('tbody') //start off table body

    var header = thead.append("tr")
      .selectAll("th")
      .data(columns) //place the columns data as the table header
      .enter()
      .append("th")
      .text(function (data) { return data; })
      .attr('text-align', 'center')

    var rows = tbody.selectAll("tr")
      .data(data) // set up the table rows with the data
      .enter()
      .append("tr")

    var cells = rows.selectAll("td")
      .data(function (row) {
        return columns.map(function (d, i) {
          return { i: d, value: row[d] }; //enter the individual values into each table row cell based on index
        });
      })
      .enter()
      .append("td")
      .html(function (data) { return data.value })

    return chart;
  }
  chart.update = function (data) {
    console.log('selector', selector)
    d3.select(selector).select('table').remove()
    table = d3.select(selector)
      .append('table')

    //Create table features
    // https://bost.ocks.org/mike/chart/ ideas from here

    var columns = Object.keys(data[0]) // the data keys of the json

    let thead = table.append('thead') //start off table head
    let tbody = table.append('tbody') //start off table body

    var header = thead.append("tr")
      .selectAll("th")
      .data(columns) //place the columns data as the table header
      .enter()
      .append("th")
      .text(function (data) { return data; })
      .attr('text-align', 'center')

    var rows = tbody.selectAll("tr")
      .data(data) // set up the table rows with the data
      .enter()
      .append("tr")

    var cells = rows.selectAll("td")
      .data(function (row) {
        return columns.map(function (d, i) {
          return { i: d, value: row[d] }; //enter the individual values into each table row cell based on index
        });
      })
      .enter()
      .append("td")
      .html(function (data) { return data.value })
  }
  // Below are the potential changes that could be made using the resuable charts model

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

  chart.columns = function (_) {
    if (!arguments.length) return columns;
    columns = _;
    return chart;
  };

  return chart

};