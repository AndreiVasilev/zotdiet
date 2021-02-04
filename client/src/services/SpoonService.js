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

}

const spoonService = new SpoonService();
export default spoonService;
