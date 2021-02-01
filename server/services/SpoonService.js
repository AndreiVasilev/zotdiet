const axios = require('axios');

class SpoonService {

    constructor() {
        
    }

    async getTestApiCall() {
        console.log('Test Request Made.')
        let requestStr = this.getBaseUrl() + 'recipes/complexSearch?' + this.getApiKeyStr() + '&cuisine=italian&intolerances=gluten'
        console.log(requestStr)
        axios.get(requestStr)
        .then(res => {
            console.log(res.data)
            return res
        })
        .catch( err => console.log('Test Request Failed.\n' + err))
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
