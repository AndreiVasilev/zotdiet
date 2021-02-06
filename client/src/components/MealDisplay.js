import React  from "react";
import "./MealDisplay.css"
import "../App.css"

import MealDisplayImg from "./MealDisplayImg";

function MealDisplay(props) {
    const { mealType, mealName, openModal } = props;
    return (
        <div className="meal-display-container" onClick={openModal}>
            <p>{mealType}</p>
            <MealDisplayImg mealImg="../assets/icon.png" mealName={mealName}/>
            <p>{mealName}</p>
        </div>
    );
}

export default MealDisplay;
