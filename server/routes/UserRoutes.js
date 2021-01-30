const {userService} = require('../services/UserService');

module.exports = (app) => {

    app.get('/api/user', async (req, res) => {
        if (req.session && req.session.userId) {
            const user = await userService.getUser(req.session.userId)
                .catch(err => {
                    console.err(`Unable to get user ${req.session.userId}`, err);
                    res.status(500);
                    res.send('Session not found. Please login and try again');
                });

            if (user) {
                res.json(user);
                return;
            }
        }

        res.status(500);
        res.send('Session not found. Please login and try again');
    });


    app.post('/api/user/login', async (req, res) => {

        // Attempt to login by creating Google access token
        const loginResult = await userService.login(req.body.code);
        if (!loginResult) {
            res.status(500);
            res.send('Login failed.');
            return;
        }

        // Get Google user info and determine if user already
        // exists with that id in our database
        const googleUser = loginResult.googleUser;
        let user = await userService.getUser(googleUser.id);
        let isNew = false;

        // Create new user if user not found
        if (!user) {
            user = await userService.createUser(googleUser);
            isNew = true;
        }

        // Unable to create new user, respond with failure
        if (!user) {
            res.status(500);
            res.send(`Failed to create new user ${googleUser.id}.`);
            return;
        }

        // Store user related information in their session
        req.session.accessToken = loginResult.token;
        req.session.userId = user.id;
        req.session.loggedIn = true;
        res.json({isNew: isNew});
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
