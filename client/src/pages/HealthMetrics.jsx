import React, { useEffect, useState, useCallback } from "react";
import "./HealthMetrics.css";
import { PieChart } from "react-minimal-pie-chart";
import { Button, Card } from "react-bootstrap";
import CountUp from "react-countup";
import footsteps from "../assets/footstep.svg";
import LineChart from "../components/LineChart";
import moment from "moment";
import userService from "../services/UserService";

const HealthMetrics = () => {
  const [selectedData, setSelectedData] = useState({});
  const [pastSteps, setPastSteps] = useState([]);
  const [steps, setSteps] = useState(0);

  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  const [currentDateRange, setCurrentDateRange] = useState(
    `${moment(`${month + 1}.${day}.${year}`, "MM-DD-YYYY")
      .subtract(7, "days")
      .calendar()} - ${month + 1}/${day}/${year}`
  );

  let pastThirtyDays = [];

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

  const PIE_ANIMATION_DURATION = 2000;
  const BASE_COLOR = "#F59E0B";
  const BASE_COLOR_TRANSPARENT = "rgba(245, 158, 11, 0.2)";

  const formatNumber = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  useCallback(() => {
    for (let i = 30; i > 0; i--) {
      const pastDate = new Date(new Date().setDate(new Date().getDate() - i));
      const formattedDate = `${
        MONTHS[pastDate.getMonth()]
      } ${pastDate.getDate()}`;
      pastThirtyDays.push(formattedDate);
    }
    console.log(pastThirtyDays);
  }, [pastThirtyDays])();

  const datasets = [
    {
      labels: pastThirtyDays.slice(
        pastThirtyDays.length - 7,
        pastThirtyDays.length
      ),
      datasets: [
        {
          label: "7 Days (steps)",
          data: pastSteps.slice(pastSteps.length - 8, pastSteps.length),
          borderColor: [BASE_COLOR],
          backgroundColor: [BASE_COLOR_TRANSPARENT],
          pointBackgroundColor: [BASE_COLOR],
          pointBorderColor: [BASE_COLOR],
        },
      ],
    },
    {
      labels: pastThirtyDays,
      datasets: [
        {
          label: "30 Days (steps)",
          data: pastSteps.slice(pastSteps.length - 31, pastSteps.length),
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

  useEffect(() => {
    userService.getUserSteps().then((stepData) => {
      const ldStepCount = stepData[stepData.length - 1];
      setSteps(ldStepCount);
      setPastSteps(stepData);
      console.log(stepData);
    });
  }, []);

  return (
    <Card className="metrics-container">
      <Card.Body className="metrics-content">
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
              end={steps}
              duration={PIE_ANIMATION_DURATION / 1000}
            />
            <span className="text-base"> steps</span>
          </div>
        </div>
        <div className="weight-graph">
          <h1>Step Graph</h1>

          <p>{currentDateRange}</p>
          <div className="weight-chart">
            <LineChart data={selectedData} />
          </div>
          <div className="cta-btns">
            <Button
              onClick={() => {
                setSelectedData(datasets[0]);
                setCurrentDateRange(
                  `${moment(`${month + 1}.${day}.${year}`, "MM-DD-YYYY")
                    .subtract(7, "days")
                    .calendar()} - ${month + 1}/${day}/${year}`
                );
              }}
              variant="primary"
            >
              7 Days
            </Button>{" "}
            <Button
              onClick={() => {
                setSelectedData(datasets[1]);
                setCurrentDateRange(
                  `${moment(`${month + 1}.${day}.${year}`, "MM-DD-YYYY")
                    .subtract(30, "days")
                    .calendar()} - ${month + 1}/${day}/${year}`
                );
              }}
              variant="success"
            >
              30 Days
            </Button>{" "}
            {/* <Button
              onClick={() => {
                setSelectedData(datasets[2]);
              }}
              variant="warning"
            >
              90 Days
            </Button>{" "} */}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default HealthMetrics;
