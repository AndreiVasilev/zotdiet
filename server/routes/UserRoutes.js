module.exports = (app) => {

    const userService = require('../services/UserService');

    app.post('/api/user/login', async (req, res) => {
        const result = await userService.login(req.body.code);
        if (result) {
            res.status(200);
            res.send('login success');
        } else {
            res.status(500);
            res.send('login failure');
        }
    });

}
