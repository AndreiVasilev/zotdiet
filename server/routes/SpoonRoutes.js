const spoonRouter = require('express').Router()
const spoonService = require('../services/SpoonService')
// const Note = require('../models/spoon')

spoonRouter.get('/test', async (request, response) => {
    
    console.log('Test Route Called.')

    let data = await spoonService.getTestApiCall()
    
    console.log('Test Route Returning.')
    
    response.json(data)

})

spoonRouter.get('/recipes/:id/information', async (request, response) => {

    console.log('Test Route Called.')

    let data = await spoonService.getRecipeByID(request.params.id)
    
    console.log('Test Route Returning.')
    
    response.json(data)
    
})

spoonRouter.get('/recipes/:id/ingredients', async (request, response) => {
    let data = await spoonService.getIngredientsByRecipeID(request.params.id)
  response.json(data)
})

spoonRouter.get('/recipes/informationBulk', async (request, response) => {
    let data = await spoonService.getRecipeByIDBulk(request.query.ids)
    response.json(data)
})


spoonRouter.get('/recipes/shoppingList', async (request, response) => {
    let data = await spoonService.getShoppingList(request.query.ids)
    response.json(data)
})


spoonRouter.get('/mealplanner/generate', async (request, response) => {

    console.log('Test Route Called.')
    console.log('request cals: ' + request.query.calories)

    let data = await spoonService.generateMealPlan(request.query.calories, request.query.timeFrame, request.query.diet, request.query.exclude)
    
    console.log('Test Route Returning.')
    
    response.json(data)
    
})


spoonRouter.get('/mealplanner/generateSet', async (request, response) => {

    console.log('Meal Plan Set Route Called.')
    console.log('request cals: ' + request.query.calories)

    let data = await spoonService.generateMealPlanSet(request.query.calories, request.query.diet, request.query.exclude, request.query.numPlans)

    console.log('Meal Plan Set Returning.')

    response.json(data)

})



module.exports = spoonRouter