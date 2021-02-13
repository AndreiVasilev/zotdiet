import React, { useState, useEffect }  from "react";
import "./MealDisplay.css";
import "../App.css";
import userService from "../services/UserService";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import {faThumbsDown} from "@fortawesome/free-solid-svg-icons/faThumbsDown";

import MealDisplayImg from "./MealDisplayImg";

function MealDisplay(props) {
    const { mealType, mealName, url, img, cookTime, liked, disliked, openModal } = props;
    const [thumbsUp, setThumbsUp] = useState(liked);
    const [thumbsDown, setThumbsDown] = useState(disliked);

    const toggleThumbs = (dir) => {
        // cannot have both thumbs up and thumbs down selected
        switch(dir) {
            case "up":
                setThumbsUp(!thumbsUp);
                setThumbsDown(false);
                // TODO set in DB
                break;
            case "down":
                setThumbsDown(!thumbsDown);
                setThumbsUp(false);
                // TODO set in DB
                break;
            default:
                setThumbsDown(false);
                setThumbsDown(false);
        }
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
