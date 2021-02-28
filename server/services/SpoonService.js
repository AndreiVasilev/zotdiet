const axios = require('axios');
const nlpService = require("./NLPService");

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

    async getIngredientsByRecipeID(recipeID){
      console.log('Get Recipe Ingredients Request Made.')
      let requestStr = 'recipes/' + recipeID + '/ingredientWidget.json'
      requestStr = this.getBaseUrl() + requestStr + '?' + this.getApiKeyStr()

      try {
        let res = await axios.get(requestStr)
        console.log('Get Recipe Ingredients Request Succeeded.')

        // get ingredients names and perform NLP to standardize
        let ingredients = res.data.ingredients;
        ingredients = ingredients.map(ingredient => nlpService.standardize(ingredient.name)).flat();  // flatten 2D array to 1D array
        return ingredients
      }
      catch {
        console.log('Get Recipe Ingredients Request Failed.')
        return {'result': 'failed'}
      }
    }

    async getRecipeByIDBulk(recipeIDs){
        console.log('Get Recipe Ingredients Request Made.')
        let requestStr = 'recipes/informationBulk'
        requestStr = this.getBaseUrl() + requestStr + '?' + this.getApiKeyStr()
        requestStr = requestStr + '&ids=' + recipeIDs


        try {
          let res = await axios.get(requestStr)
          console.log('Get Recipe Ingredients Bulk Request Succeeded.')
          return res.data
        }
        catch (err) {
          console.log('Get Recipe Ingredients Request Failed.')
          return {'result': 'failed'}
        }
    }


    async getShoppingList(recipeIDs){
        console.log('Get Shopping List Request Made.')
  
        try {
          let recipesInfo = await this.getRecipeByIDBulk(recipeIDs)

          let shoppingList = [];
          recipesInfo.forEach(recipe => {
              let exIngs = recipe.extendedIngredients
              exIngs.forEach(ingredient => {
                  shoppingList.push(ingredient.original)
              })
          })
          console.log('Get Shopping List Bulk Request Succeeded.')
          return shoppingList
        }
        catch {
          console.log('Get Recipe Ingredients Request Failed.')
          return {'result': 'failed'}
        }
    }

    

    async generateMealPlan(targetCalories, timeFrame, diet, excludeIngredients){
        console.debug('Get Meal Plan Request Made.')

        let requestStr = this.getBaseUrl() + 'mealplanner/generate?' + this.getApiKeyStr()
        let mealPlanStr = '&timeFrame=' + timeFrame
        mealPlanStr += '&targetCalories=' + targetCalories
        mealPlanStr += '&diet=' + diet

        if (excludeIngredients) {
            mealPlanStr += '&exclude=' + excludeIngredients;
        }

        requestStr += mealPlanStr

        console.debug(requestStr)

        const res = await axios.get(requestStr).catch(err => console.error("Failed to generate meal plan.", err));
        if (!res) {
            return [];
        }

        console.debug('Generate Meal Plan Request Succeeded.')
        return res.data
    }

    async generateMealPlanSet(targetCalories, timeFrame, diet, excludeIngredients, numPlans){

        console.debug('Generate Meal Plan Set Function Entered.')
        const mealPromises = []

        for(let i = 0; i < numPlans; i++){
            const mealPromise = this.generateMealPlan(targetCalories, timeFrame, diet, excludeIngredients)
            mealPromises.push(mealPromise)
        }

        const mealPlans = await Promise.all(mealPromises);

        console.debug('Generate Meal Plan Set Function Succeeded.')
        return mealPlans
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
