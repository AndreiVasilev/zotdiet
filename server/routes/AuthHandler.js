function authHandler(req, res, next) {
    if (!req.session || !req.session.loggedIn) {
        res.status(401).send('Not authorized. Please login and try again');
        return;
    }
    next();
}

module.exports = authHandler;
