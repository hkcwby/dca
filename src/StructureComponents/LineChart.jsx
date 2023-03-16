import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function LineChart({ chartData }) {
  return (
    <div className="Chart-container">
      {/* <h2 style={{ textAlign: "center" }}>Results:</h2> */}
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "DCA Value vs Invested Amount",
            },
            legend: {
              display: true,
              fullSize: true,
            },
          },
        }}
      />
    </div>
  );
}
export default LineChart;
