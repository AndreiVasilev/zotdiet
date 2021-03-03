import React, {useEffect, useState} from "react";
import {Card, Tab, Tabs} from 'react-bootstrap';
import "./MealPlan.css";
import "../App.css";

import MealDisplay from "../components/MealDisplay";
import MealNutritionInfo from "../components/MealNutritionInfo";

import userService from "../services/UserService";

const DAY_LABELS = {
  SUNDAY: "Sun",
  MONDAY: "Mon",
  TUESDAY: "Tues",
  WEDNESDAY: "Wed",
  THURSDAY: "Thurs",
  FRIDAY: "Fri",
  SATURDAY: "Sat"
};

const MEAL_DAYS = {
  SUNDAY: "sunday",
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday"
};

const getCurDay = () => new Date().getDay();

function MealPlan() {
  const [curTabIdx, setCurTabIdx] = useState(getCurDay());
  const [meals, setMeals] = useState(null);
  const [likedMeals, setLikedMeals] = useState([]);
  const [dislikedMeals, setDislikedMeals] = useState([]);
  const [readyToLoadMealPlan, setReadyToLoadMealPlan] = useState(false);  // need to fetch liked/disliked meals before loading meal plan

  const getMealImgUrl = (mealId) => {
    return `https://spoonacular.com/recipeImages/${mealId}-556x370.jpg`
  }

  const isLikedMeal = (mealId) => likedMeals.includes(mealId);
  const isDislikedMeal = (mealId) => dislikedMeals.includes(mealId);

  useEffect(() => {
    userService.getLikedMeals().then(likedMeals => {
      setLikedMeals(likedMeals);
      userService.getDislikedMeals().then(dislikedMeals => {
        setDislikedMeals(dislikedMeals);
        setReadyToLoadMealPlan(true);
      })
    })
  }, []);

  useEffect(() => {
    if(readyToLoadMealPlan) {
      userService.getMealPlan().then(meals => {
        setMeals(meals);
      })
    }
  }, [readyToLoadMealPlan]);

  return (
    <Card className="page-container">
      { !meals &&
      <div className="loading-container">
        <p className="loading-text">Loading...</p>
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </div>
      }
      <Card.Body>
        <Tabs id="meal-plan-container" transition={false} variant="tabs"
              defaultActiveKey={getCurDay()} activeKey={curTabIdx} onSelect={(idx) => setCurTabIdx(idx)}>
          {meals &&
          Object.entries(DAY_LABELS).map(([day, label], idx) => {
            const curDay = meals[MEAL_DAYS[day]];
            const curDayMeals = curDay.meals;
            const curDayNutrients = curDay.nutrients;
            const breakfast = curDayMeals[0];
            const lunch = curDayMeals[1];
            const dinner = curDayMeals[2];
            return (
              <Tab tabClassName="meal-plan-tab" eventKey={idx.toString()} title={label} key={idx}>
                <div className="daily-meals-container">
                  {/*Breakfast */}
                  <MealDisplay mealId={breakfast.id}
                               mealType="Breakfast" mealName={breakfast.title} url={breakfast.sourceUrl}
                               img={getMealImgUrl(breakfast.id)} cookTime={breakfast.readyInMinutes}
                               liked={isLikedMeal(breakfast.id)} disliked={isDislikedMeal(breakfast.id)}
                  />

                  {/* Lunch */}
                  <MealDisplay mealId={lunch.id}
                               mealType="Lunch" mealName={lunch.title} url={lunch.sourceUrl}
                               img={getMealImgUrl(lunch.id)} cookTime={lunch.readyInMinutes}
                               liked={isLikedMeal(lunch.id)} disliked={isDislikedMeal(lunch.id)}
                  />

                  {/* Dinner */}
                  <MealDisplay mealId={dinner.id}
                               mealType="Dinner" mealName={dinner.title} url={dinner.sourceUrl}
                               img={getMealImgUrl(dinner.id)} cookTime={dinner.readyInMinutes}
                               liked={isLikedMeal(dinner.id)} disliked={isDislikedMeal(dinner.id)}
                  />
                </div>
                <hr className="meal-plan-separator"/>
                <MealNutritionInfo nutrition={curDayNutrients}/>
              </Tab>
            )
          })
          }
        </Tabs>
      </Card.Body>
    </Card>
  );
}

export default MealPlan;
