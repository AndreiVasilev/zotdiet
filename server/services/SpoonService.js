const axios = require('axios')


class SpoonService {

    constructor() {
        // initialize spoonacular service
    }

    async test() {
        const testStr = 'test worked!'

        // Not Sure where this shows up??
        console.log('test worked..')

        if (testStr.length > 0) {
            return true;
        }
        return false;
    }
}

// Export singleton instance of UserService
module.exports = new SpoonService();
