# Navigation Demo

This project demonstrates a navigation chart using D3.js and data from an Excel sheet.

## Features

- Fetch data from an Excel file.
- Adjust overlapping points to avoid visual clutter.
- Plot a scatter plot with animated points and lines.
- Display tooltips on hover.

## Requirements

- D3.js
- XLSX.js

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/gurupavani31/Navigation_Demo.git
    ```
2. Open the `index.html` file in your web browser.

## Usage

1. Ensure your Excel file (`timelineTask.xlsx`) is in the same directory as `index.html`.
2. Open `index.html` in a web browser to view the navigation chart.

## Files

- `index.html`: Main HTML file.
- `navigationChart.js`: JavaScript file containing the D3 chart logic.
- `timelineTask.xlsx`: Excel file containing the data.

## Data Format

The Excel file should have the following columns:
- `Timeline`
- `Title for resource`
- `href`
- `type`
- `x`
- `y`
