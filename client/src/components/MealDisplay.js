import React  from "react";
import MealNutritionInfo from "./MealNutritionInfo";
import "./MealDisplay.css";
import "../App.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";

import MealDisplayImg from "./MealDisplayImg";

function MealDisplay(props) {
    const { mealType, mealName, cookTime, nutrition, openModal } = props;
    return (
        <div className="meal-display-container" onClick={openModal}>
            <p className="bold-text meal-display-text">{mealType}</p>
            <MealDisplayImg mealImg="../assets/icon.png" mealName={mealName}/>
            <p className="bold-text meal-display-text">{mealName}</p>
            <p className="meal-display-text meal-display-text-sm">
                <FontAwesomeIcon icon={faClock} size="3x" className="meal-time-icon" />
                Ready in {cookTime} minutes
            </p>
            {/*<MealNutritionInfo nutrition={nutrition}/>*/}
        </div>
    );
}

export default MealDisplay;
