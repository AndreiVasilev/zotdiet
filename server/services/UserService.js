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
}
