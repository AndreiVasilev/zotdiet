import React, { useState }  from "react";
import "./MealDisplay.css";
import "../App.css";

import userService from "../services/UserService";
import spoonService from "../services/SpoonService";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import {faThumbsDown} from "@fortawesome/free-solid-svg-icons/faThumbsDown";

import MealDisplayImg from "./MealDisplayImg";

function MealDisplay(props) {
    const { mealId, mealType, mealName, url, img, cookTime, liked, disliked, openModal } = props;
    const [thumbsUp, setThumbsUp] = useState(liked);
    const [thumbsDown, setThumbsDown] = useState(disliked);

    const toggleThumbs = (dir) => {
        let isAdding = false;
        switch(dir) {
          case "up":
                isAdding = !thumbsUp;  // if was previously not thumbs up and just switched to thumbs up, then adding to liked
                setThumbsUp(!thumbsUp);
                setThumbsDown(false);  // cannot have both thumbs up and thumbs down selected
                getIngredients().then(ingredients => {   // keep track of liked ingredients
                  userService.updateMealPreferences(mealId, ingredients, true, isAdding);  // last 2 params: flags for whether add/remove liked meals
                });
                break;
            case "down":
                isAdding = !thumbsDown;  // if was previously not thumbs down and just switched to thumbs down, then adding to disliked
                setThumbsDown(!thumbsDown);
                setThumbsUp(false);    // cannot have both thumbs up and thumbs down selected
                getIngredients().then(ingredients => {   // keep track of disliked ingredients
                  userService.updateMealPreferences(mealId, ingredients, false, isAdding);  // last 2 params: flags for whether add/remove liked meals
                });
                break;
            default:
                setThumbsDown(false);
                setThumbsDown(false);
        }
    };

    // get ingredients for recipe
    const getIngredients = async () => {
      let ingredients = await spoonService.getMealIngredients(mealId);
      return ingredients;
    };

    return (
        <div className="meal-display-container" onClick={openModal}>
            <p className="bold-text meal-display-text">{mealType}</p>
            <a href={url} target="_blank" rel="noopener">
                <MealDisplayImg mealImg={img}  mealName={mealName}/>
                <p className="bold-text meal-display-text">{mealName}</p>
            </a>
            <p className="meal-display-text meal-display-text-sm">
                <FontAwesomeIcon icon={faClock} size="3x" className="meal-display-icon meal-time-icon" />
                Ready in {cookTime} minutes
            </p>
            <div className="thumbs-container">
                <FontAwesomeIcon icon={faThumbsUp} size="3x" onClick={() => toggleThumbs("up")}
                     className={`meal-display-icon meal-thumbs-icon ${thumbsUp ? "thumbs-selected" : "thumbs-unselected"}`}
                />
                <FontAwesomeIcon icon={faThumbsDown} size="3x" onClick={() => toggleThumbs("down")}
                     className={`meal-display-icon meal-thumbs-icon ${thumbsDown ? "thumbs-selected" : "thumbs-unselected"}`}
                />
            </div>
        </div>
    );
}

export default MealDisplay;
