import React, { useState, useEffect }  from "react";
import "./MealDisplay.css";
import "../App.css";
import userService from "../services/UserService";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import {faThumbsDown} from "@fortawesome/free-solid-svg-icons/faThumbsDown";

import MealDisplayImg from "./MealDisplayImg";
import spoonService from "../services/SpoonService";

function MealDisplay(props) {
    const { mealId, mealType, mealName, url, img, cookTime, liked, disliked, openModal } = props;
    const [thumbsUp, setThumbsUp] = useState(liked);
    const [thumbsDown, setThumbsDown] = useState(disliked);

    const toggleThumbs = (dir) => {
        switch(dir) {
            case "up":
                setThumbsUp(!thumbsUp);
                setThumbsDown(false);  // cannot have both thumbs up and thumbs down selected
                userService.updateLikedMeals(mealId);
                break;
            case "down":
                setThumbsDown(!thumbsDown);
                setThumbsUp(false);    // cannot have both thumbs up and thumbs down selected
                getIngredients().then(ingredients => {   // keep track of disliked ingredients
                  userService.updateDislikedMeals(mealId, ingredients);
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
      ingredients = ingredients.map(ingredient => ingredient.name);  // only store ingredient name
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
