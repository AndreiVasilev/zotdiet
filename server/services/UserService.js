const {google} = require('googleapis');

class UserService {

    /**
     * Logs a user in by taking the authorization code provided by the Google login button,
     * and generates an access token that can be used to acquire the users information.
     *
     * @param authCode - The Google API authorization code provided by client login
     * @return {Promise<Credentials>}
     */
    async login(authCode) {
        const oAuthClient = this.getOAuthClient();
        const {tokens} = await oAuthClient.getToken(authCode)
            .catch(err => {
                console.error('Unable to generate access token from provided authorization code', err)
            });

        if (!tokens) {
            throw new Error('Login failed.');
        }

        return tokens;
    }

    /**
     * Gets the Google ID of the currently logged in User.
     */
    async getUserId(accessToken) {
        const oauth2Client = this.getOAuthClient();
        oauth2Client.setCredentials(accessToken);
        return new Promise((resolve, reject) => {
            google.oauth2({auth: oauth2Client, version: 'v2'}).userinfo.get((err, res) => {
                  if (err) { reject(err); }
                  resolve(res.data.id);
              }
            );
        });
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
