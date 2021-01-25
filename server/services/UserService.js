const {google} = require('googleapis');

class UserService {

    constructor() {
        this._oauth2Client = new google.auth.OAuth2(
          process.env.REACT_APP_GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_AUTH_REDIRECT
        );
        google.options({auth: this._oauth2Client});
    }

    async login(code) {
        const {tokens} = await this._oauth2Client.getToken(code)
            .catch(err => {
                console.error(`Unable to generate access token from provided ${code}`, err)
            });

        if (tokens) {
            this._oauth2Client.setCredentials(tokens);
            return true;
        }
        return false;
    }
}

// Export singleton instance of UserService
module.exports = new UserService();
