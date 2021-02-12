import React  from "react";
import "./MealDisplayImg.css"
import "../App.css"

function MealDisplayImg(props) {
    const { mealImg, mealName } = props;
    return (
        <img src={mealImg} alt={"Image of "+mealName} className="meal-display-img"/>
    );
}

export default MealDisplayImg;
