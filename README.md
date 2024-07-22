# Navigation Demo

## Overview

The Navigation Demo project is a web-based visualization tool that reads data from an Excel file and displays it as a scatter plot with additional features like tooltips and color coding based on data type. The plot shows the relationship between data points and provides additional context via interactive elements.

## Features

- **Data Visualization**: Displays data from an Excel sheet as a scatter plot with lines connecting points.
- **Tooltips**: Hover over data points to view detailed information.
- **Color Coding**: Data points are color-coded based on their type.
- **Overlap Adjustment**: Automatically adjusts overlapping points for better visibility.

## Technologies Used

- **D3.js**: JavaScript library for manipulating documents based on data.
- **Plot**: Plotting library from ObservableHQ for creating interactive charts.
- **xlsx**: Library for parsing Excel files.

## Setup

1. **Include Libraries**: Ensure the necessary libraries are included in your HTML file:
    ```html
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@observablehq/plot@0.2.2/dist/plot.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
    ```

2. **HTML Structure**: Your HTML file should have a container for the chart:
    ```html
    <div id="chart-container"></div>
    ```

3. **JavaScript File**: Include the `navigationChart.js` script in your HTML file:
    ```html
    <script src='navigationChart.js'></script>
    ```

## JavaScript Functions

- **`fetchAndParseExcel(url)`**: Fetches and parses an Excel file from the given URL, converting it into JSON format.
- **`adjustOverlappingPoints(data, offset)`**: Adjusts overlapping points by shifting their positions.
- **`initializeData()`**: Fetches data from the Excel file, adjusts overlapping points, and then plots the scatter plot.
- **`plotScatterPlot(dataset)`**: Creates and renders a scatter plot using the data provided.

## How to Use

1. **Update Excel File URL**: Modify the `excelUrl` variable in `navigationChart.js` to point to your Excel file.
    ```javascript
    const excelUrl = 'timelineTask.xlsx';
    ```

2. **Data Format**: Ensure your Excel file has the following columns: `x`, `y`, `Timeline`, `Title for resource`, `href`, and `type`.

3. **Run the Project**: Open the HTML file in a web browser. The chart should render and display the data from the Excel file.