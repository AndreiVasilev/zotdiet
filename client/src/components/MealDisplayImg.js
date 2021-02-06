import React  from "react";
import "./MealDisplayImg.css"
import "../App.css"

import logo from "../assets/logo.png"; // TODO set img src to mealImg prop and remove this

function MealDisplayImg(props) {
    const { mealImg, mealName } = props;
    return (
        <img src={logo} alt={"Image of "+mealName} className="meal-display-img"/>
    );
}

export default MealDisplayImg;
