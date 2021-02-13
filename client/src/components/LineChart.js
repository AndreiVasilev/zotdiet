import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ data }) {
  const options = {
    title: {
      display: true,
      text: "Step Trend",
    },
  };

  return <Line data={data} options={options} />;
}

export default LineChart;
