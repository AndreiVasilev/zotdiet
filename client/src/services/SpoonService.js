import axios from "axios";

class SpoonService {

    constructor() {
        // TODO get from backend
        this.diets = [
            'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian',
            'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30',
        ];

        this.intolerances = [
            'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame',
            'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat',
        ];
    }

    getDiets() {
        return this.diets;
    }

    getIntolerances() {
        return this.intolerances;
    }

    async getMealIngredients(mealId) {
      const response = await axios.get(`/spoon/recipes/${mealId}/ingredients`)
        .catch(err => console.error('Unable to get recipe ingredients', err));
      return (response && response.status === 200) ? response.data.ingredients : null;
    }
}

const spoonService = new SpoonService();
export default spoonService;
