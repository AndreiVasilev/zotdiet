const {userService} = require('../services/UserService');

module.exports = (app) => {

    app.post('/api/user/login', async (req, res) => {
        const loginResult = await userService.login(req.body.code);
        if (!loginResult) {
            res.status(500);
            res.send('Login failed.');
            return;
        }

        const googleUser = loginResult.googleUser;
        let user = await userService.getUser(googleUser.id);
        let newUser = false;

        if (!user) {
            user = await userService.createUser(googleUser);
            newUser = true;
        }

        req.session.accessToken = loginResult.token;
        req.session.loggedIn = true;
        res.json({user: user, new: newUser});
    });


    app.post('/api/user/logout', async (req, res) => {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send('Logout failed.');
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
