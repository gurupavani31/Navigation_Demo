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
  // Define margins and dimensions for the plot
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3.select('#chart-container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Define scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, d => d.x1)).nice()
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, d => d.y1)).nice()
    .range([height, 0]);

  // Add axes
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale));

  
   // Add x-axis label
   svg.append('text')
   .attr('class', 'x-axis-label')
   .attr('x', width / 2)
   .attr('y', height + margin.bottom)
   .attr('text-anchor', 'middle')
   .text('X Axis');

 // Add y-axis label
 svg.append('text')
   .attr('class', 'y-axis-label')
   .attr('transform', 'rotate(-90)')
   .attr('x', -height / 2)
   .attr('y', -margin.left + 20)
   .attr('text-anchor', 'middle')
   .text('Y Axis');

  // Add line
  const line = d3.line()
    .x(d => xScale(d.x1))
    .y(d => yScale(d.y1))
    .curve(d3.curveCatmullRom);

  const linePath = svg.append('path')
    .datum(dataset)
    .attr('class', 'line')
    .attr('d', line)
    .style('stroke', '#666')
    .style('fill', 'none');

  const totalLength = linePath.node().getTotalLength();

  linePath
    .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);

  // Add dots with transitions
  const dots = svg.selectAll('.dot')
    .data(dataset)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.x1))
    .attr('cy', height) 
    .attr('r', 0) 
    .style('fill', d => d.type === 'resource' ? 'blue' : d.type === 'quiz' ? 'green' : 'orange')
    .style('opacity', 0) 
    .on('mouseover', function(event, d) {
      d3.select(this).style('opacity', 1);
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Timestamp: ${d.Timeline}<br>Title: ${d["Title for resource"] ? d["Title for resource"] : "-"}<br>URL: ${d.href ? d.href : "-"}<br>Type: ${d.type}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      d3.select(this).style('opacity', 0.8);
      tooltip.transition().duration(500).style('opacity', 0);
    });

  // Apply animation to dots
  dots.transition()
    .duration(1000) 
    .delay((d, i) => i * 100) 
    .attr('cy', d => yScale(d.y1)) 
    .attr('r', 5)
    .style('opacity', 0.8)

  // Add tooltip
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Add text labels
  const labels = svg.selectAll('.label')
    .data(dataset)
    .enter().append('text')
    .attr('class', 'label')
    .attr('x', d => xScale(d.x1))
    .attr('y', d => yScale(d.y1))
    .attr('dy', -10)
    .attr('text-anchor', 'middle')
    .style('fill', d => d.type === 'resource' ? 'blue' : d.type === 'quiz' ? 'green' : 'orange')
    .style('opacity', 0)
    .text(d => d.type)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 100) 
    .style('opacity', 1); 
}
