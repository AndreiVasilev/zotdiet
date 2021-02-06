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


// TODO: Complete
spoonRouter.get('/mealplanner/generate', async (request, response) => {

    console.log('Test Route Called.')
    console.log('request cals: ' + request.query.calories)

    let data = await spoonService.generateMealPlanForWeek(request.query.calories, request.query.diet, request.query.exclude)
    
    console.log('Test Route Returning.')
    
    response.json(data)
    
})



module.exports = spoonRouter