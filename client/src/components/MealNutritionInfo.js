import React  from "react";
import "./MealNutritionInfo.css"
import "../App.css"

import {Table} from "react-bootstrap";

function MealNutritionInfo(props) {
    const { nutrition } = props;
    return (
        <Table borderless className="meal-nutrition-tbl">
            <tbody>
                <tr>
                    <td className="today-nutrition-label">TODAY</td>
                    <td>Calories: {nutrition.calories}</td>
                    <td>Fat: {nutrition.fat} g</td>
                    <td>Protein: {nutrition.protein} g</td>
                    <td>Carbs: {nutrition.carbohydrates} g</td>
                </tr>
            </tbody>
        </Table>
    );
}

export default MealNutritionInfo;
