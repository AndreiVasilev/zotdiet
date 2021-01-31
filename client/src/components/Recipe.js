import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "./Recipe.css"
import "../App.css"

import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";

function Recipe(props) {
    const { recipe } = props;
    return (
        <Container>
            <Row>
                <Col>
                    <Row className="recipe-section-header">Ingredients</Row>
                    <RecipeIngredients ingredients={recipe.ingredients} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Row className="recipe-section-header">Instructions</Row>
                    <RecipeInstructions instructions={recipe.instructions} />
                </Col>
            </Row>
        </Container>
    );
}

export default Recipe;
