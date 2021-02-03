const axios = require('axios');
const { request } = require('express');

class SpoonService {

    constructor() {
        
    }

    async getTestApiCall() {
        console.log('Test Service Called.')

        let requestStr = 'recipes/complexSearch?cuisine=italian&intolerances=gluten' 
        requestStr = this.getBaseUrl() + requestStr + '&' + this.getApiKeyStr()

        let res = await axios.get(requestStr)
        if (res == undefined){
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


    // TODO: Complete
    async getSimilarRecipeByID(recipeID){
        console.log('Get Recipe Request Made.')
        let requestStr = 'recipes/' + recipeID + '/information' 

        axios.get(requestStr)
        .then(res => {
            return res
        })
        .catch( err => console.log('Get Recipe Request Failed.\n' + err))
    }

    // TODO: Complete
    async generateMealPlanForWeek(targetCalories, diet, excludeIngredients){
        console.log('Get Meal Plan for Week Request Made.')

        let mealPlanStr = 'mealplanner/generate?'
        mealPlanStr = 'time=week&targetCalories=' + targetCalories
        mealPlanStr += '&diet=' + diet
        mealPlanStr += '&exclude=' + this.arrayToCommanSeparatedList(excludeIngredients)

        requestStr = (mealPlanStr)

        axios.get(requestStr)
        .then(res => {
            return res
        })
        .catch( err => console.log('Get Meal Plan for Week Request Failed.\n' + err))
    }

    arrayToCommanSeparatedList(arr){
        index = 0
        let resultStr = ''
        while (index < arr.length - 1){
            resultStr += arr[index] + ','
            index++
        }
        resultStr += arr[index]
        return resultStr
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
