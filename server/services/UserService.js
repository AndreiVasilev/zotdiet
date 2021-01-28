const {google} = require('googleapis');

class UserService {

    async login(code, session) {
        const oAuthClient = this.getOAuthClient();
        const {tokens} = await oAuthClient.getToken(code)
            .catch(err => {
                console.error(`Unable to generate access token from provided ${code}`, err)
            });
        return tokens;
    }

    getOAuthClient() {
        return new google.auth.OAuth2(
          process.env.REACT_APP_GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_AUTH_REDIRECT
        );
    }
}

module.exports = {
    userService: new UserService(),
};
