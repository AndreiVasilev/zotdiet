import axios from "axios";

class SpoonService {
  constructor() {
    // TODO get from backend
    this.diets = [
      "Gluten Free",
      "Ketogenic",
      "Vegetarian",
      "Lacto-Vegetarian",
      "Ovo-Vegetarian",
      "Vegan",
      "Pescetarian",
      "Paleo",
      "Primal",
      "Whole30",
    ];

    this.cuisines = [
      "African",
      "American",
      "British",
      "Cajun",
      "Caribbean",
      "Chinese",
      "Eastern European",
      "European",
      "French",
      "German",
      "Greek",
      "Indian",
      "Irish",
      "Italian",
      "Japanese",
      "Jewish",
      "Korean",
      "Latin American",
      "Mediterranean",
      "Mexican",
      "Middle Eastern",
      "Nordic",
      "Southern",
      "Spanish",
      "Thai",
      "Vietnamese",
    ];

    this.intolerances = [
      "Dairy",
      "Egg",
      "Gluten",
      "Grain",
      "Peanut",
      "Seafood",
      "Sesame",
      "Shellfish",
      "Soy",
      "Sulfite",
      "Tree Nut",
      "Wheat",
    ];
  }

  getDiets() {
    return this.diets;
  }

  getIntolerances() {
    return this.intolerances;
  }

  getCuisines() {
    return this.cuisines;
  }

  async getMealIngredients(mealId) {
    const response = await axios
      .get(`/spoon/recipes/${mealId}/ingredients`)
      .catch((err) => console.error("Unable to get recipe ingredients", err));
    return response && response.status === 200 ? response.data : null;
  }

  async getBulkMealIngredients(mealIds) {
    const response = await axios
      .get(`/spoon/recipes/informationBulk`, { params: { ids: mealIds } })
      .catch((err) => console.error("Unable to get recipe ingredients", err));
    return response && response.status === 200 ? response.data : null;
  }
}

const spoonService = new SpoonService();
export default spoonService;
