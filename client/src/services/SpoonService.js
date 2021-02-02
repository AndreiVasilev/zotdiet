class SpoonService {

    constructor() {
        // TODO get from backend
        this.cuisines = [
            'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
            'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian',
            'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American',
            'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern',
            'Spanish', 'Thai', 'Vietnamese'
        ];

        this.diets = [
            'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian',
            'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30',
        ];

        this.intolerances = [
            'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame',
            'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat',
        ];
    }

    getCuisines() {
        return this.cuisines;
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
