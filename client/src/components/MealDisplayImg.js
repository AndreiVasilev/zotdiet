import React  from "react";
import "./MealDisplayImg.css"
import "../App.css"

import icon from "../assets/icon.png"; // TODO set img src to mealImg prop and remove this

function MealDisplayImg(props) {
    const { mealImg, mealName } = props;
    return (
        <img src={icon} alt={"Image of "+mealName} className="meal-display-img"/>
    );
}

export default MealDisplayImg;
