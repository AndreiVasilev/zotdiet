import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import "./HealthMetrics.css";
import { PieChart } from "react-minimal-pie-chart";
import { Button } from "react-bootstrap";
import CountUp from "react-countup";
import footsteps from "../assets/footstep.svg";
import LineChart from "../components/LineChart";
import moment from "moment";

const HealthMetrics = () => {
  const [selectedData, setSelectedData] = useState({});
  const [sevenDay, setSevenDay] = useState(false);
  const [thirtyDay, setThirtyDay] = useState(false);
  const [ninetyDay, setNinetyDay] = useState(false);

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  const PIE_ANIMATION_DURATION = 3000;
  const BASE_COLOR = "#F59E0B";
  const BASE_COLOR_TRANSPARENT = "rgba(245, 158, 11, 0.2)";

  const formatNumber = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const datasets = [
    {
      labels: [
        `${month + 1}/${day - 6}`,
        `${month + 1}/${day - 5}`,
        `${month + 1}/${day - 4}`,
        `${month + 1}/${day - 3}`,
        `${month + 1}/${day - 2}`,
        `${month + 1}/${day - 1}`,
        `${month + 1}/${day}`,
      ],
      datasets: [
        {
          label: "7 Days (lbs)",
          data: [200, 145, 400, 130, 115, 200, 105],
          borderColor: [BASE_COLOR],
          backgroundColor: [BASE_COLOR_TRANSPARENT],
          pointBackgroundColor: [BASE_COLOR],
          pointBorderColor: [BASE_COLOR],
        },
      ],
    },
    {
      labels: [
        `${month + 1}/${day - 6}`,
        `${month + 1}/${day - 5}`,
        `${month + 1}/${day - 4}`,
        `${month + 1}/${day - 3}`,
        `${month + 1}/${day - 2}`,
        `${month + 1}/${day - 1}`,
        `${month + 1}/${day}`,
      ],
      datasets: [
        {
          label: "30 Days (lbs)",
          data: [470, 340, 200, 130, 350, 110, 50],
          borderColor: [BASE_COLOR],
          backgroundColor: [BASE_COLOR_TRANSPARENT],
          pointBackgroundColor: [BASE_COLOR],
          pointBorderColor: [BASE_COLOR],
        },
      ],
    },
    {
      labels: [
        `${month + 1}/${day - 6}`,
        `${month + 1}/${day - 5}`,
        `${month + 1}/${day - 4}`,
        `${month + 1}/${day - 3}`,
        `${month + 1}/${day - 2}`,
        `${month + 1}/${day - 1}`,
        `${month + 1}/${day}`,
      ],
      datasets: [
        {
          label: "90 Days (lbs)",
          data: [10, 100, 500, 600, 400, 200, 0],
          borderColor: [BASE_COLOR],
          backgroundColor: [BASE_COLOR_TRANSPARENT],
          pointBackgroundColor: [BASE_COLOR],
          pointBorderColor: [BASE_COLOR],
        },
      ],
    },
  ];

  useEffect(() => {
    setSelectedData(datasets[0]);
  }, []);

  return (
    <React.Fragment>
      <NavBar />
      <div className="metrics-container">
        <div className="metrics-content">
          <div className="steps">
            <h1>Steps Today</h1>
            <p>{`${MONTHS[month]} ${day}, ${year}`}</p>
            <div className="steps-chart">
              <PieChart
                data={[{ value: 10, color: "url(#gradient1)" }]}
                lineWidth={15}
                radius={40}
                animationDuration={PIE_ANIMATION_DURATION}
                rounded
                animate
              >
                <defs>
                  <linearGradient id="gradient1">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="30%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </PieChart>
              <img
                className="footsteps-graphic"
                src={footsteps}
                alt="Footsteps"
              />
            </div>
            <div className="step-number">
              <CountUp
                start={0}
                end={49800}
                duration={PIE_ANIMATION_DURATION / 1000}
              />
              <span className="text-base"> steps</span>
            </div>
          </div>
          <div className="weight-graph">
            <h1>Weight Graph</h1>

            <p>{`${moment(`${month}.${day}.${year}`, "MM-DD-YYYY")
              .subtract(7, "days")
              .calendar()} - ${month}/${day}/${year}`}</p>
            <div className="weight-chart">
              <LineChart data={selectedData} />
            </div>
            <div className="cta-btns">
              <Button
                onClick={() => {
                  setSelectedData(datasets[0]);
                }}
                variant="primary"
              >
                7 Days
              </Button>{" "}
              <Button
                onClick={() => {
                  setSelectedData(datasets[1]);
                }}
                variant="success"
              >
                30 Days
              </Button>{" "}
              <Button
                onClick={() => {
                  setSelectedData(datasets[2]);
                }}
                variant="warning"
              >
                90 Days
              </Button>{" "}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HealthMetrics;
