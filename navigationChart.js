const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3.scaleLinear()
  .range([0, width]);

const y = d3.scaleLinear()
  .range([height, 0]);

  const svg = d3.select("#chart-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// data initialization
let dataset =[];
// fetch data from the e
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
    }
  }
  
  const excelUrl = 'timelineTask.xlsx';
  
// function to call the fetch function
async function initializeData() {
    try {
        dataset = await fetchAndParseExcel(excelUrl);
        console.log('Data initialized:', dataset);
    } catch (error) {
        console.error('Error fetching or parsing the Excel file:', error);
    }
}

initializeData();

console.log(dataset);

// Define the x and y domains

x.domain(d3.extent(dataset, d => d.x));
y.domain([0, d3.max(dataset, d => d.y)]);

// Add the x-axis

svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x)); 


// Add the y-axis

svg.append("g")
  .call(d3.axisLeft(y))

// Create the line generator

const line = d3.line()
  .x(d => x(d.x))
  .y(d => y(d.y));

// Add the line path to the SVG element

svg.append("path")
  .datum(dataset)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1)
  .attr("d", line);
  