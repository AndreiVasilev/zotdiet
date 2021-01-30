import React  from "react";
import "./RecipeIngredients.css"
import "../App.css"

import {Table} from "react-bootstrap";

function RecipeIngredients(props) {
    const { ingredients } = props;
    return (
        <Table borderless className="recipe-ingredients-tbl">
            <tbody>
                {
                    ingredients.map((ingredient) => {
                        return (
                            <tr>
                                <td className="recipe-ingredient-name">{ingredient.name}</td>
                                <td className="recipe-ingredient-quantity">{ingredient.quantity}</td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </Table>
    );
}

export default RecipeIngredients;
