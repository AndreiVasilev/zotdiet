
const spoonService = require('./SpoonService');

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

        return spoonService.generateMealPlanForWeek(targetCalories, user.diet, user.intolerances);
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
}

module.exports = {
    mealPlanService: new MealPlanService()
}
