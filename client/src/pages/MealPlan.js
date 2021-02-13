import React, {useEffect, useState} from "react";
import {Card, Col, Container, Modal, Row, Tab, Tabs} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";

import "./MealPlan.css";
import "../App.css";
import MealDisplay from "../components/MealDisplay";
import MealDisplayImg from "../components/MealDisplayImg";
import MealNutritionInfo from "../components/MealNutritionInfo";
import Recipe from "../components/Recipe";
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
    const [showModal, setShowModal] = useState(false);
    const [curTabIdx, setCurTabIdx] = useState(getCurDay());
    const [modalMeal, setModalMeal] = useState({});
    const [meals, setMeals] = useState(null);
    const [likedMeals, setLikedMeals] = useState([]);
    const [dislikedMeals, setDislikedMeals] = useState([]);

    const handleCloseModal = () => setShowModal(false);

    const handleShowModal = (mealType) => {
        setModalMeal(meals[curTabIdx][mealType]);
        setShowModal(true);
    }

    const getMealImgUrl = (mealId) => {
        return `https://spoonacular.com/recipeImages/${mealId}-556x370.jpg`
    }

    useEffect(() => {
        userService.getMealPlan().then(meals => {
            setMeals(meals);
        })
    }, []);

    useEffect(() => {
      userService.getDislikedMeals().then(dislikedMeals => {
        setDislikedMeals(dislikedMeals);
      })
    }, []);

    useEffect(() => {
      userService.getLikedMeals().then(likedMeals => {
        setLikedMeals(likedMeals);
      })
    }, []);

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
                                            liked={likedMeals.includes(breakfast.id)} disliked={dislikedMeals.includes(breakfast.id)}
                                            // openModal={() => handleShowModal('breakfast')}
                                        />

                                        {/* Lunch */}
                                        <MealDisplay mealId={lunch.id}
                                            mealType="Lunch" mealName={lunch.title} url={lunch.sourceUrl}
                                            img={getMealImgUrl(lunch.id)} cookTime={lunch.readyInMinutes}
                                            liked={likedMeals.includes(lunch.id)} disliked={dislikedMeals.includes(lunch.id)}
                                            // openModal={() => handleShowModal('lunch')}
                                        />

                                        {/* Dinner */}
                                        <MealDisplay mealId={dinner.id}
                                            mealType="Dinner" mealName={dinner.title} url={dinner.sourceUrl}
                                            img={getMealImgUrl(dinner.id)} cookTime={dinner.readyInMinutes}
                                            liked={likedMeals.includes(dinner.id)} disliked={dislikedMeals.includes(dinner.id)}
                                            // openModal={() => handleShowModal('dinner')}
                                        />
                                    </div>
                                    <hr className="meal-plan-separator"/>
                                    <MealNutritionInfo nutrition={curDayNutrients}/>
                                </Tab>
                            )
                        })
                    }
                </Tabs>

                {/* Expanded Meal Info */}
                {/*<Modal show={showModal} onHide={handleCloseModal}>*/}
                {/*    <Container className="meal-modal">*/}
                {/*        <Row>*/}
                {/*            <Col lg={4}>*/}
                {/*                <Row className="modal-section-name center-content">{modalMeal.name}</Row>*/}
                {/*                <Row className="modal-meal-cuisine center-content">{modalMeal.cuisine}</Row>*/}
                {/*                <Row className="center-content">*/}
                {/*                    <MealDisplayImg mealImg="-- TODO --" mealName={modalMeal.name}/>   /!* TODO set mealImg prop with Spoon img *!/*/}
                {/*                </Row>*/}
                {/*                <Row className="center-content">*/}
                {/*                    <MealNutritionInfo nutrition={modalMeal.nutrition} />*/}
                {/*                </Row>*/}
                {/*            </Col>*/}
                {/*            <Col lg={{offset: 1}}>*/}
                {/*                <Row className="modal-section-name">Recipe</Row>*/}
                {/*                <Recipe recipe={modalMeal.recipe}/>*/}
                {/*            </Col>*/}
                {/*            <Col lg={1} style={{textAlign: "right"}}>*/}
                {/*                <FontAwesomeIcon icon={faHeart} size="3x" onClick={toggleHeart} className={`heart-icon ${mealHearted ? "heart-selected" : "heart-unselected"}`} />*/}
                {/*            </Col>*/}
                {/*        </Row>*/}
                {/*    </Container>*/}
                {/*</Modal>*/}
            </Card.Body>
        </Card>
    );
}

export default MealPlan;
