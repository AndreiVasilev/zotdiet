const axios = require('axios');

class SpoonService {

    async getTestApiCall() {
        console.log('Test Service Called.')

        let requestStr = 'recipes/complexSearch?cuisine=italian&intolerances=gluten' 
        requestStr = this.getBaseUrl() + requestStr + '&' + this.getApiKeyStr()

        let res = await axios.get(requestStr)
        if (!res){
            console.log('Test Request Failed.')
            return {'result': 'failed'}
        }
        console.log('Test Request Succeeded.')
        return res.data
    }

    async getRecipeByID(recipeID){
        console.log('Get Recipe Request Made.')
        let requestStr = 'recipes/' + recipeID + '/information' 
        requestStr = this.getBaseUrl() + requestStr + '?' + this.getApiKeyStr()
        
        try {
            let res = await axios.get(requestStr)
            console.log('Get Recipe Request Succeeded.')
            return res.data
        }
        catch {
            console.log('Get Recipe Request Failed.')
            return {'result': 'failed'}
        }
           
    }

    async generateMealPlanForWeek(targetCalories, diet, excludeIngredients){
        console.log('Get Meal Plan for Week Request Made.')

        let requestStr = this.getBaseUrl() + 'mealplanner/generate?' + this.getApiKeyStr()
        let mealPlanStr = '&timeFrame=week&targetCalories=' + targetCalories
        mealPlanStr += '&diet=' + diet

        if (excludeIngredients) {
            mealPlanStr += '&exclude=' + excludeIngredients;
        }

        requestStr += mealPlanStr

        console.log(requestStr)

        const res = await axios.get(requestStr).catch(err => console.error("Failed to generate meal plan.", err));
        if (!res) {
            return [];
        }

        console.log('Generate Meal Plan Request Succeeded.')
        console.log(res.data)
        return res.data
    }


    getBaseUrl(){
        return 'https://api.spoonacular.com/'
    }

    getApiKeyStr(){
        return 'apiKey=' + process.env.SPOONACULAR_API_KEY
    }
}

// Export singleton instance of UserService
module.exports = new SpoonService();
