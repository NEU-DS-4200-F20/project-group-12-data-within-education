
((() => {
  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/data.json").then(data => {

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
      const students = {}
      let userId = 1
      classData.forEach(c => {
        students[c.userId] = c.name
      })
      formatDropDown()
      const { studentClassData, ...multilineChartData } = getChartDataByUserId(userId)
      let multiline = multilinechart()("#multilinechart", multilineChartData)
      let multilinetable = table()("#multilinetable", studentClassData);
      function getChartDataByUserId(userId) {
        const studentClassData = classData.filter(d => d.userId == userId)
        const groupByClassMap = {}
        let dates = []
        studentClassData.forEach(data => {
          if (!groupByClassMap[data.className]) {
            groupByClassMap[data.className] = {}
          }

          groupByClassMap[data.className][data.dueDate] = (data.score / data.totalPoints) * 100
          if (!dates.includes(data.dueDate)) {
            dates.push(data.dueDate)
          }
        })
        dates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

        const series = Object.keys(groupByClassMap).map(key => {
          return {
            name: key,
            values: dates.map(d => groupByClassMap[key][d])
          }
        })
        console.log('dates', dates, series)

        dates = dates.map(d => d3.utcParse("%m-%d-%Y")(d))
        return { series, dates, name: students[userId], studentClassData }
      }

      // dropdown内容
      function formatDropDown() {
        document.querySelector(
          '.dropdown .dropdown-menu'
        ).innerHTML = Object.keys(students)
          .map(uid =>
            userId == uid
              ? `<li class="active dropdown-menu-item" data-student="${uid}" onclick="onSelectStudent(event)">${students[uid]}</li>`
              : `<li class="dropdown-menu-item" data-student="${uid}" onclick="onSelectStudent(event)">${students[uid]}</li>`
          )
          .join('');

        document.querySelector(
          '.dropdown .dropdown-button'
        ).innerHTML = `${students[userId]}<span class="caret"></span>`;

        window.onSelectStudent = (e) => {
          const target = e.target;
          document
            .querySelectorAll('.dropdown .dropdown-menu .dropdown-menu-item')
            .forEach(dom => {
              dom.setAttribute('class', 'dropdown-menu-item');
            });
          userId = target.getAttribute('data-student');
          target.setAttribute('class', 'dropdown-menu-item active');
          document.querySelector(
            '.dropdown .dropdown-button'
          ).innerHTML = `${students[userId]}<span class="caret"></span>`;
          const { studentClassData, ...multilineChartData } = getChartDataByUserId(userId)
          multiline.update(multilineChartData)
          multilinetable.update(studentClassData)
        }

        window.onClickButton = (e) => {
          e.stopPropagation();
          document.querySelector('.dropdown .dropdown-menu').style =
            'display: block';
        }
        document.addEventListener('click', function () {
          document.querySelector('.dropdown .dropdown-menu').style =
            'display: none;';
        });
      }
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

