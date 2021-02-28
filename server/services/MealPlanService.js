const spoonService = require('./SpoonService');
const nlpService = require('./NLPService');
const {Heap} = require('../Heap');

class MealPlanService {

    constructor() {
        this.calorieMultipliers = {
            MILD_LOSS: 0.9,
            NORMAL_LOSS: 0.81,
            INTENSE_LOSS: 0.61,
            MILD_GAIN: 1.1,
            NORMAL_GAIN: 1.19,
            INTENSE_GAIN: 1.39
        }
        this.activityMultipliers = {
            SEDENTARY: 1.2,
            LIGHT: 1.375,
            MODERATE: 1.55,
            INTENSE: 1.725,
            EXTREME: 1.9
        }
    }

    async generateMealPlan(user, steps) {

        /*
            Calculate user's daily target calories based on their age,
            weight, height, gender, activity level, and weight goals
         */
        const bmr = this.getUserBMR(user);
        const activityLevel = this.getActivityLevel(steps);
        const maintainCalories = bmr * activityLevel;
        let targetCalories = maintainCalories;

        console.log(`Generating meal plan for user ${user.id}, 
            based on ${bmr} calorie BMR, ${activityLevel} 
            activity level, and ${user.goal} weight goal.`);

        if (user.goal === 'Lose') {
            targetCalories = maintainCalories * this.getCalorieMultiplier(true, user.pace);
        }
        else if (user.goal === 'Gain') {
            targetCalories = maintainCalories * this.getCalorieMultiplier(false, user.pace);
        }

        /*
            Get a set of initial meals from Spoonacular matching the constraints calculated
            above and then further rank meals based on user's liked/disliked ingredients and
            cuisine preferences.
         */
        const mealsToRank = 10;
        const mealPlans = await spoonService.generateMealPlanSet(targetCalories, 'day', user.diet, user.intolerances, mealsToRank);
        const recipeIds = mealPlans.map(plan => plan.meals.map(meal => meal.id)).flatMap(ids => ids);
        const bulkMeals = await spoonService.getRecipeByIDBulk(recipeIds);
        const mealScores = this.getMealScores(user, bulkMeals);

        const rankedMeals = new Heap(mealsToRank);
        for (const plan of mealPlans) {
            let score = plan.meals.map(meal => mealScores[meal.id]).reduce((a,b) => a + b, 0);
            rankedMeals.push(plan, score);
        }

        console.log(rankedMeals);

        const topPlans = rankedMeals.values.slice(1, 9);
        return {
            sunday: topPlans[0],
            monday: topPlans[1],
            tuesday: topPlans[2],
            wednesday: topPlans[3],
            thursday: topPlans[4],
            friday: topPlans[5],
            saturday: topPlans[6]
        }
    }

    getActivityLevel(stepCounts) {
        const avgSteps = stepCounts.reduce((a, b) => a + b) / stepCounts.length;
        switch(true) {
            case (avgSteps < 5000): return this.activityMultipliers.SEDENTARY;
            case (avgSteps < 7500): return this.activityMultipliers.LIGHT;
            case (avgSteps < 10000): return this.activityMultipliers.MODERATE;
            case (avgSteps < 12500): return this.activityMultipliers.INTENSE;
        }
        return this.activityMultipliers.EXTREME;
    }

    getCalorieMultiplier(lose, pace) {
        if (pace.startsWith("Mild")) {
            return lose ? this.calorieMultipliers.MILD_LOSS : this.calorieMultipliers.MILD_GAIN;
        }
        else if (pace.startsWith("Normal")) {
            return lose ? this.calorieMultipliers.NORMAL_LOSS : this.calorieMultipliers.NORMAL_GAIN;
        }
        return lose ? this.calorieMultipliers.INTENSE_LOSS : this.calorieMultipliers.INTENSE_GAIN;
    }

    getMealScores(user, meals) {
        const mealScores = {};
        for (const meal of meals) {
            mealScores[meal.id] = this._getMealScore(meal, user);
        }
        return mealScores;
    }

    /**
     * Gets the Basal Metabolic Rate of the given user
     * based ont the Revised Harris-Benedict Formula
     */
    getUserBMR(user) {
        if (user.gender === 'Female') {
            return 447.6 + 9.25 * this._getKilogramWeight(user.weight) +
                3.10 * this._getCmHeight(user.heightFt, user.heightIn) -
                4.33 * user.age;
        }

        return 88.4 + 13.4 * this._getKilogramWeight(user.weight) +
            4.8 * this._getCmHeight(user.heightFt, user.heightIn) -
            5.68 * user.age;
    }

    _getKilogramWeight(weight) {
        const kilogramsPerPound = 0.453592;
        return weight * kilogramsPerPound;
    }

    _getCmHeight(feet, inches) {
        const cmPerInch = 2.54;
        return feet * 12 * cmPerInch + inches * cmPerInch
    }

    _getMealScore(meal, user) {
        if (user.dislikedMeals && user.dislikedMeals.includes(meal.id)) {
            return Number.MIN_SAFE_INTEGER;
        }

        const ingredients = meal.extendedIngredients.map(ing => nlpService.standardize(ing.name)).flat();
        let score = 0;

        for (const ingredient of ingredients) {
            if (user.likedIngredients && user.likedIngredients[ingredient]) {
                score += user.likedIngredients[ingredient];
            }
            if (user.dislikedIngredients && user.dislikedIngredients[ingredient]) {
                score -= user.dislikedIngredients[ingredient];
            }
        }

        return score;
    }
}

module.exports = {
    mealPlanService: new MealPlanService()
}
