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

const getCurDay = () => new Date().getDay();

function MealPlan() {
    const [showModal, setShowModal] = useState(false);
    const [curTabIdx, setCurTabIdx] = useState(getCurDay());
    const [modalMeal, setModalMeal] = useState({});
    const [mealHearted, setMealHearted] = useState(false);  // TODO set default based on whether modalMeal hearted
    const [meals, setMeals] = useState([]);

    const handleCloseModal = () => setShowModal(false);

    const handleShowModal = (mealType) => {
        setModalMeal(meals[curTabIdx][mealType]);
        setShowModal(true);
    }

    const toggleHeart = () => {
        // TODO: save in DB for modalMeal
        setMealHearted(!mealHearted);
    }

    useEffect(() => {
        userService.getMealPlan().then(meals =>{
            setMeals(meals);
        })
    }, []);

    // TODO remove this variable (just temp for testing while not getting data from Spoon API/DB)
    // const meals = Array(7).fill(
    //     {
    //         breakfast: {
    //             name: "Omelette",
    //             nutrition: {
    //                 calories: 250,
    //                 cuisine: "American",
    //                 protein: "5g",
    //                 carbs: "20g",
    //                 sugar: "10g"
    //             },
    //             recipe: {
    //                 ingredients: [
    //                     {
    //                         name: "Ingredient1",
    //                         quantity: "2 lbs"
    //                     },
    //                     {
    //                         name: "Ingredient2",
    //                         quantity: "5 tbsp"
    //                     },
    //                     {
    //                         name: "Ingredient3",
    //                         quantity: "7"
    //                     }
    //                 ],
    //                 instructions: [
    //                     "Lorem ipsum dolor sit amet",
    //                     "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
    //                     "Lorem ipsum dolor sit amet Enjoy!",
    //                 ]
    //             },
    //             hearted: true
    //         },
    //         lunch: {
    //     name: "Omelette",
    //         nutrition: {
    //         calories: 250,
    //             cuisine: "American",
    //             protein: "5g",
    //             carbs: "20g",
    //             sugar: "10g"
    //     },
    //     recipe: {
    //         ingredients: [
    //             {
    //                 name: "Ingredient1",
    //                 quantity: "2 lbs"
    //             },
    //             {
    //                 name: "Ingredient2",
    //                 quantity: "5 tbsp"
    //             },
    //             {
    //                 name: "Ingredient3",
    //                 quantity: "7"
    //             }
    //         ],
    //             instructions: [
    //             "Lorem ipsum dolor sit amet",
    //             "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
    //             "Lorem ipsum dolor sit amet Enjoy!",
    //         ]
    //     },
    //     hearted: true
    // },
    //         dinner: {
    //     name: "Omelette",
    //         nutrition: {
    //         calories: 250,
    //             cuisine: "American",
    //             protein: "5g",
    //             carbs: "20g",
    //             sugar: "10g"
    //     },
    //     recipe: {
    //         ingredients: [
    //             {
    //                 name: "Ingredient1",
    //                 quantity: "2 lbs"
    //             },
    //             {
    //                 name: "Ingredient2",
    //                 quantity: "5 tbsp"
    //             },
    //             {
    //                 name: "Ingredient3",
    //                 quantity: "7"
    //             }
    //         ],
    //             instructions: [
    //             "Lorem ipsum dolor sit amet",
    //             "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
    //             "Lorem ipsum dolor sit amet Enjoy!",
    //         ]
    //     },
    //     hearted: true
    // }
    //     });

    // const getMeals = () => {
    //   TODO get data from Spoonacular/DB
    // }

    return (
        <Card className="page-container">
            <Card.Body>
                <Tabs id="meal-plan-container" transition={false} variant="tabs"
                      defaultActiveKey={getCurDay()} activeKey={curTabIdx} onSelect={(idx) => setCurTabIdx(idx)} >
                    {
                        Object.entries(DAY_LABELS).map(([day, label], idx) => {
                            return (
                                <Tab tabClassName="meal-plan-tab" eventKey={idx.toString()} title={label} key={idx}>
                                    <div className="daily-meals-container">
                                        <MealDisplay mealType="Breakfast" mealName={meals[idx].breakfast.name} openModal={() => handleShowModal('breakfast')}/>
                                        <MealDisplay mealType="Lunch" mealName={meals[idx].lunch.name} openModal={() => handleShowModal('lunch')}/>
                                        <MealDisplay mealType="Dinner" mealName={meals[idx].dinner.name} openModal={() => handleShowModal('dinner')}/>
                                    </div>
                                </Tab>
                            )
                        })
                    }
                </Tabs>

                {/* Expanded Meal Info */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Container className="meal-modal">
                        <Row>
                            <Col lg={4}>
                                <Row className="modal-section-name center-content">{modalMeal.name}</Row>
                                <Row className="modal-meal-cuisine center-content">{modalMeal.cuisine}</Row>
                                <Row className="center-content">
                                    <MealDisplayImg mealImg="-- TODO --" mealName={modalMeal.name}/>   {/* TODO set mealImg prop with Spoon img */}
                                </Row>
                                <Row className="center-content">
                                    <MealNutritionInfo nutrition={modalMeal.nutrition} />
                                </Row>
                            </Col>
                            <Col lg={{offset: 1}}>
                                <Row className="modal-section-name">Recipe</Row>
                                <Recipe recipe={modalMeal.recipe}/>
                            </Col>
                            <Col lg={1} style={{textAlign: "right"}}>
                                <FontAwesomeIcon icon={faHeart} size="3x" onClick={toggleHeart} className={`heart-icon ${mealHearted ? "heart-selected" : "heart-unselected"}`} />
                            </Col>
                        </Row>
                    </Container>
                </Modal>
            </Card.Body>
        </Card>
    );
}

export default MealPlan;
