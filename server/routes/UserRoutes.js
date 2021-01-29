const {userService} = require('../services/UserService');

module.exports = (app) => {

    app.post('/api/user/login', async (req, res) => {
        // const result = await userService.login(req.body.code);
        // if (result) {
        //     res.send('login success');
        // } else {
        //     res.status(500);
        //     res.send('login failure');
        // }
        req.session.loggedIn = true;
        res.send('Login success');
    });

    app.post('/api/user/logout', async (req, res) => {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send('Logout failure.');
            } else {
                res.send('Logout success');
            }
        });
    });

    app.get('/api/user/loggedIn', async (req, res) => {
        res.type('application/json')
        res.json({loggedIn: req.session.loggedIn ? req.session.loggedIn : false});
    });

}
