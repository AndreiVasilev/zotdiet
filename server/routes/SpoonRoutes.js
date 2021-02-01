const spoonRouter = require('express').Router()
const spoonService = require('../services/SpoonService')
// const Note = require('../models/spoon')

spoonRouter.get('/test', (request, response) => {
  response.json(spoonService.getTestApiCall())
})



module.exports = spoonRouter