import React  from "react";
import "./MealDisplay.css";
import "../App.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";

import MealDisplayImg from "./MealDisplayImg";

function MealDisplay(props) {
    const { mealType, mealName, url, img, cookTime, openModal } = props;
    return (
        <div className="meal-display-container" onClick={openModal}>
            <p className="bold-text meal-display-text">{mealType}</p>
            <a href={url} target="_blank">
                <MealDisplayImg mealImg={img}  mealName={mealName}/>
                <p className="bold-text meal-display-text">{mealName}</p>
            </a>
            <p className="meal-display-text meal-display-text-sm">
                <FontAwesomeIcon icon={faClock} size="3x" className="meal-time-icon" />
                Ready in {cookTime} minutes
            </p>
        </div>
    );
}

export default MealDisplay;
