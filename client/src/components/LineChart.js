import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ data }) {
  const options = {
    title: {
      display: true,
      text: "Weight Trend",
    },
  };

  return <Line data={data} options={options} />;
}

export default LineChart;
