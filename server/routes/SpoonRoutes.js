module.exports = (app) => {

    const spoonService = require('../services/spoonService');

    app.get('/api/spoon/test', async (req, res) => {
        const result = await spoonService.test();
        if (result) {
            res.status(200);
            res.send('test success');
        } else {
            res.status(500);
            res.send('test failure');
        }
    });

}
