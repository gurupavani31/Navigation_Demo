// fetch data from the excel sheet
async function fetchAndParseExcel(url) {

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      return jsonData;
    } catch (error) {
      console.error('Error fetching or parsing the Excel file:', error);
      return [];
    }
  }
  

// Function to adjust overlapping points
function adjustOverlappingPoints(data, offset) {
  const positionMap = new Map();
  const adjustedData = [];

  data.forEach((d, i) => {
      const key = `${d.x},${d.y}`;
      let dx = 0;
      let dy = 0;

      if (positionMap.has(key)) {
          const count = positionMap.get(key);
          dx = (count % 5) * offset; // Adjusting x position
          dy = Math.floor(count / 5) * offset; // Adjusting y position
          positionMap.set(key, count + 1);
      } else {
          positionMap.set(key, 1);
      }

      adjustedData.push({
          ...d,
          x1: d.x + dx,
          y1: d.y + dy
      });
  });

  return adjustedData;
}

const excelUrl = 'timelineTask.xlsx';
  
// function to call the fetch function
async function initializeData() {
    try {
        const dataset = await fetchAndParseExcel(excelUrl);
        console.log('Data initialized:', dataset);
        const offset = 0.04;
        const adjustedData = adjustOverlappingPoints(dataset, offset);
        plotScatterPlot(adjustedData)
    } catch (error) {
        console.error('Error fetching or parsing the Excel file:', error);
    }
}

initializeData();

function plotScatterPlot(dataset){
  const plot = Plot.plot({
    inset: 10,
        grid: true,
        width: 800,
        height: 500,
        x: { label: "X Axis" },
        y: { label: "Y Axis" },
        marks: [
            Plot.line(dataset, {x: "x1", y: "y1", curve: "catmull-rom", marker: true,stroke:"#666"}),
            Plot.dot(dataset, {
                x: 'x1',
                y: 'y1',
                r: 4,
                title: d => 
                    `Timestamp: ${d.Timeline}\nTitle: ${d["Title for resource"]?d["Title for resource"]:"-"}\nURL: ${d.href?d.href:"-"}\nType: ${d.type}`,
                fill: d => d.type === "resource" ? "blue" :d.type === "quiz"? "green":"orange",
            }),
            Plot.text(dataset, {
                x: 'x1',
                y: 'y1',
                text: d => d.type,
                dy: -10,
                fill: d => d.type === "resource" ? "blue" :d.type === "quiz"? "green":"orange",
            })
        ]
  })

  document.getElementById('chart-container').appendChild(plot);
}
