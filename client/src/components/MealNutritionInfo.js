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
                    <td className="calories">Calories:</td>
                    <td>{nutrition.calories}</td>
                </tr>
                <tr>
                    <td>Protein:</td>
                    <td>{nutrition.protein}</td>
                </tr>
                <tr>
                    <td>Carbs:</td>
                    <td>{nutrition.carbs}</td>
                </tr>
                <tr>
                    <td>Sugar:</td>
                    <td>{nutrition.sugar}</td>
                </tr>
            </tbody>
        </Table>
    );
}

export default MealNutritionInfo;
