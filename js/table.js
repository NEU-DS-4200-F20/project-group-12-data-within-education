/* global D3 */

// Initialize a table Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function table(){

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 20
      },
      width = 500 - margin.left - margin.right,
      selectableElements = d3.select(null),
      height = 500 - margin.top - margin.bottom;


  function chart(selector, data) {


    // Please note: We tried adjusting the style for the table here, but with no luck
    // All style changes including width, height, translate, and more were done within the styles.cc
    // for the table-holder div. That was the only workaround we found with David Saffo during OH
    // Because it is a HTML table and our limited knowledge, we were unsure how to make the table responsive to screen size changes
    let table = d3.select(selector)
        .append('table')


    //Create table features
    // https://bost.ocks.org/mike/chart/ ideas from here

    var columns = ["name", "className", "title", "score", "totalPoints", "submitTime", "dueDate"] // the data keys of the json


    let thead = table.append('thead') //start off table head
    let tbody = table.append('tbody') //start off table body

    var header = thead.append("tr")
        .selectAll("th")
        .data(["Student name", "Class", "Assignment", "Grade", "Available Points", "Time submitted", "Due Date"]) //place the columns data as the table header
        .enter()
        .append("th")
        .text(function(data){return data;})
        .attr('text-align', 'center')

    var rows = tbody.selectAll("tr")
        .data(data) // set up the table rows with the data
        .enter()
        .append("tr")

    var cells = rows.selectAll("td")
        .data(function(row){
          return columns.map(function(d, i){
            return {i: d, value: row[d]}; //enter the individual values into each table row cell based on index
          });
        })
        .enter()
        .append("td")
        .html(function(data){ return data.value})
    
    selectableElements = d3.selectAll(rows)

    
    chart.update = function (data) {
      console.log('selector', selector)
      d3.select(selector).select('table').remove()
      table = d3.select(selector)
          .append('table')

      //Create table features
      // https://bost.ocks.org/mike/chart/ ideas from here

      let thead = table.append('thead') //start off table head
      let tbody = table.append('tbody') //start off table body

      var header = thead.append("tr")
          .selectAll("th")
          .data(["Student name", "Class", "Assignment", "Grade", "Available Points", "Time submitted", "Due Date"])
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
    

    selectableElements = d3.selectAll(rows)
    var continueSelection = d3.dispatch('continueSelection')
    var triggerMouseup = d3.dispatch('triggerMouseup')
    var resumeMouseover = d3.dispatch('resumeMouseover')
    var resetEvents = d3.dispatch('resetEvents')

    //Dispatch Event to reset the prior dispatch events on the table
    // All previous selected and highlighted events are wiped away
    // after the next mousedown, wipe all selections/highlights
    // then highlight/select that first row mousedown'd on
    // send that data to the other charts, then dispatch trigger the
    resetEvents.on('resetEvents', function(){
        selectableElements.on("mousedown", (event, d) => {
            d3.selectAll(rows).classed('selected', false) //clear all selected style rows
            d3.selectAll(rows).classed('highlighted', false) // clear all highlighted style rows
            d3.select(event.currentTarget).classed('highlighted', true) // highlight style the row mousedown'd on
            d3.select(event.currentTarget).classed('selected', true) // select style the row to send to the other charts
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, event.currentTarget, table.selectAll('.selected').data());
            continueSelection.call('continueSelection')
        })
    })

    //This dispatch event handles how the mouseover will perform
    // If the current targets class is 'selected', then the highlighted mouseover will follow
    // If the class is not 'selected', a gray mouseover will follow
    // The mouseout makes sure the ensuing state of the row does not stay highlighted as red or mouseover'd as grey

    resumeMouseover.on('resumeMouseover', function(selections){
       selectableElements.on("mouseover", (event, d) => { //Idea for if statement found here: https://stackoverflow.com/questions/45423918/event-listener-to-determine-if-clicked-target-is-element-of-specific-class
            if (event.currentTarget.className === 'selected'){ //if class of table row is selected
            d3.select(event.currentTarget).classed('highlighted', true) //Mouse over using the highlighted style
            resetEvents.call('resetEvents') //trigger resetEvents
            }
            else{
            d3.select(event.currentTarget).classed('mouseover', true) //Mouse over using the mouseover style
            resetEvents.call('resetEvents') //trigger resetEvents
            }
            })
        .on("mouseout", (event, d) => {
                d3.select(event.currentTarget).classed('mouseover', false) //remove the mosueover style after mouseout
                d3.selectAll(rows).classed('highlighted', false) //remove the highlighted style after mouseout
                resetEvents.call('resetEvents') //trigger resetEvents to take next step
                })
    })
    // When the mouse click is released, trigger a mouseup event to handle
    // the resulting mouseovers
    triggerMouseup.on('triggerMouseup', function(){
            selectableElements.on("mouseup", (event, d) => {
                resumeMouseover.call('resumeMouseover') //resumeMouseover handles the mouseover events after this continueSeleciton selection stage
            })
        })
    
    // While the mouse is still down perform a mouseover event
    // Perform proper highlighting and selection
    continueSelection.on('continueSelection', function(){ //trigger dispatch event function
            selectableElements.on('mouseover', (event, d) => {
            d3.selectAll(rows).classed('highlighted', false) // Remove any previous highlighted rows style
            d3.select(event.currentTarget).classed('highlighted', true) //Immeadietly highlight the selection 
            d3.select(event.currentTarget).classed('selected', true) //Immeadielty turn it to a selected class to send to the other charts
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, event.currentTarget, table.selectAll('.selected').data());
            triggerMouseup.call('triggerMouseup')
            })
            .on("mouseup", (event, d) => {
                resumeMouseover.call('resumeMouseover') //skip mouseup event and immeadietly trigger resumeMouseover
            })
            }
        )
    
    // Basic mouse events
    // The mousedown triggers the resulting dispatch events        
    d3.selectAll(rows)
        .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).classed('mouseover', true) //normal mouseover style prior to any clicks
        })
    
    .on("mousedown", (event, d) => { 
            d3.select(event.currentTarget).classed('highlighted', true) //Highlight current selection
            d3.select(event.currentTarget).classed('selected', true) // Immeadiately turn it to a selected class to sent to the charts
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, event.currentTarget, table.selectAll('.selected').data()); // Send selected class to charts
            continueSelection.call('continueSelection') //This triggers resulting events
        })
    .on("mouseout", (event, d) => {
            d3.select(event.currentTarget).classed('mouseover', false)
            })

    }

    selectableElements = d3.selectAll(rows)
    var continueSelection = d3.dispatch('continueSelection')
    var triggerMouseup = d3.dispatch('triggerMouseup')
    var resumeMouseover = d3.dispatch('resumeMouseover')
    var resetEvents = d3.dispatch('resetEvents')

    //Dispatch Event to reset the prior dispatch events on the table
    // All previous selected and highlighted events are wiped away
    // after the next mousedown, wipe all selections/highlights
    // then highlight/select that first row mousedown'd on
    // send that data to the other charts, then dispatch trigger the
    resetEvents.on('resetEvents', function(){
        selectableElements.on("mousedown", (event, d) => {
            d3.selectAll(rows).classed('selected', false) //clear all selected style rows
            d3.selectAll(rows).classed('highlighted', false) // clear all highlighted style rows
            d3.select(event.currentTarget).classed('highlighted', true) // highlight style the row mousedown'd on
            d3.select(event.currentTarget).classed('selected', true) // select style the row to send to the other charts
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, event.currentTarget, table.selectAll('.selected').data());
            continueSelection.call('continueSelection')
        })
    })

    //This dispatch event handles how the mouseover will perform
    // If the current targets class is 'selected', then the highlighted mouseover will follow
    // If the class is not 'selected', a gray mouseover will follow
    // The mouseout makes sure the ensuing state of the row does not stay highlighted as red or mouseover'd as grey

    resumeMouseover.on('resumeMouseover', function(selections){
       selectableElements.on("mouseover", (event, d) => { //Idea for if statement found here: https://stackoverflow.com/questions/45423918/event-listener-to-determine-if-clicked-target-is-element-of-specific-class
            if (event.currentTarget.className === 'selected'){ //if class of table row is selected
            d3.select(event.currentTarget).classed('highlighted', true) //Mouse over using the highlighted style
            resetEvents.call('resetEvents') //trigger resetEvents
            }
            else{
            d3.select(event.currentTarget).classed('mouseover', true) //Mouse over using the mouseover style
            resetEvents.call('resetEvents') //trigger resetEvents
            }
            })
        .on("mouseout", (event, d) => {
                d3.select(event.currentTarget).classed('mouseover', false) //remove the mosueover style after mouseout
                d3.selectAll(rows).classed('highlighted', false) //remove the highlighted style after mouseout
                resetEvents.call('resetEvents') //trigger resetEvents to take next step
                })
    })
    // When the mouse click is released, trigger a mouseup event to handle
    // the resulting mouseovers
    triggerMouseup.on('triggerMouseup', function(){
            selectableElements.on("mouseup", (event, d) => {
                resumeMouseover.call('resumeMouseover') //resumeMouseover handles the mouseover events after this continueSeleciton selection stage
            })
        })
    
    // While the mouse is still down perform a mouseover event
    // Perform proper highlighting and selection
    continueSelection.on('continueSelection', function(){ //trigger dispatch event function
            selectableElements.on('mouseover', (event, d) => {
            d3.selectAll(rows).classed('highlighted', false) // Remove any previous highlighted rows style
            d3.select(event.currentTarget).classed('highlighted', true) //Immeadietly highlight the selection 
            d3.select(event.currentTarget).classed('selected', true) //Immeadielty turn it to a selected class to send to the other charts
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, event.currentTarget, table.selectAll('.selected').data());
            triggerMouseup.call('triggerMouseup')
            })
            .on("mouseup", (event, d) => {
                resumeMouseover.call('resumeMouseover') //skip mouseup event and immeadietly trigger resumeMouseover
            })
            }
        )
    
    // Basic mouse events
    // The mousedown triggers the resulting dispatch events        
    d3.selectAll(rows)
        .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).classed('mouseover', true) //normal mouseover style prior to any clicks
        })
    
    .on("mousedown", (event, d) => { 
            d3.select(event.currentTarget).classed('highlighted', true) //Highlight current selection
            d3.select(event.currentTarget).classed('selected', true) // Immeadiately turn it to a selected class to sent to the charts
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, event.currentTarget, table.selectAll('.selected').data()); // Send selected class to charts
            continueSelection.call('continueSelection') //This triggers resulting events
        })
    .on("mouseout", (event, d) => {
            d3.select(event.currentTarget).classed('mouseover', false)
            })

    


    return chart;
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

  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  chart.newData = function (_) {
    if (!arguments.length) return dispatcher;
    newData = _;
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

  return chart

};