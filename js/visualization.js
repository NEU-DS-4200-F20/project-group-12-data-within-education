
    ((() => {
      // Load the data from a json file (you can make these using
      // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
      // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/data.json").then(data=> {

    console.log(data)
    data.forEach(d => {
      d.ID = d.ID;
      d.Name = d.Name;
      d.Score = +d.Score;
      d["Submission TimeStamp"] = d["Submission TimeStamp"];
      d.Timespent = +d.Timespent;
      d.Status = d.Status;
      d.Grade = d.Grade;
      d.Class = d.Class;
    });

  
    
    let scatter = scatterplot()
    .xLabel("Score")
    .yLabel('Time Spent (Minutes)')
      ("#scatterplot", data); // Call the scatterplot function on the scatterplot div

    let htmltable = table()
      ("#table", data); // Call the table function on the table div

    

    

      });
    
    })());
    