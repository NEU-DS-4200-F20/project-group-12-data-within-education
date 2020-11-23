
    ((() => {
      // Load the data from a json file (you can make these using
      // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
      // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/data.json").then(data=> {

    console.log(data)
    data.forEach(d => {
        d.classId = d.classId;
        d.className = d.className;
        d.userId = d.userId;
        d.assignId = d.assignId;
        d.submitTime = d.submitTime;
        d.score = d.score;
        d.timespent = + d.timespent;
        d.title = d.title;
        d.dueDate = d.dueDate;
        d.assignType = d.assignType;
        d.totalPoints = d.totalPoints;
        d.name = d.name;
    });
    (async function () {
      const classData = await d3.json('./data/data.json')
      const userId = 1
      const studentClassData = classData.filter(d => d.userId === userId)
      const groupByClassMap = {}
      let dates = []
      studentClassData.forEach(data => {
          if (!groupByClassMap[data.className]) {
              groupByClassMap[data.className] = {}
          }
  
          groupByClassMap[data.className][data.dueDate] = (data.score/data.totalPoints) * 100
          if (!dates.includes(data.dueDate)) {
              dates.push(data.dueDate)
          }
      })
  
      const series = Object.keys(groupByClassMap).map(key => {
          return {
              name: key,
              values: dates.map(d => groupByClassMap[key][d])
          }
      })
  
      dates = dates.map(d => d3.utcParse("%Y-%m-%d")(d))
      let multiline = multilinechart()
    ("#multilinechart", {series, dates})
  })()
  
    
    let scatter = scatterplot()
    .yLabel("Score")
    .xLabel('Time Spent (Minutes)')
      ("#scatterplot", data); // Call the scatterplot function on the scatterplot div

    let htmltable = table()
      ("#table", data); // Call the table function on the table div

    let histogram = histograms()
      ("#histogram1", data);
    
      
    
  });
    })());
    