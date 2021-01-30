import React  from "react";
import "./RecipeInstructions.css"
import "../App.css"

import {Table} from "react-bootstrap";

function RecipeInstructions(props) {
    const { instructions } = props;
    return (
        <Table borderless className="recipe-instructions-tbl">
            <tbody>
            {
                instructions.map((instruction, idx) => {
                    return (
                        <tr>
                            <td className="recipe-instruction">{idx + 1}. {instruction}</td>
                        </tr>
                    );
                })
            }
            </tbody>
        </Table>
    );
}

export default RecipeInstructions;
