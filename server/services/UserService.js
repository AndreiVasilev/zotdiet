const {google} = require('googleapis');
const {User} = require('../models/User');
const firebase = require("firebase/app");
require('firebase/database');

class UserService {

    constructor() {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        };
        firebase.initializeApp(firebaseConfig);
        this.database = firebase.database();
    }

    /**
     * Logs a user in by taking the authorization code provided by the Google login button,
     * generates a Google API access token, and acquires the user's Google profile info.
     */
    async login(authCode) {
        const token = await this.getAccessToken(authCode);
        if (!token) {
            return null;
        }

        const gUser = await this.getGoogleUser(token);
        if (!gUser) {
            return null;
        }

        return {
            token: token,
            googleUser: gUser,
        };
    }

    /**
     * Creates a new entry within the database using the user id as the key
     */
    createUser(user) {
        return new Promise((resolve, reject) => {
            this.database.ref(`/users/${user.id}`).set(user)
              .then(_ => resolve(user))
              .catch(err => {
                console.error(`Unable to create new user ${user.id}`, err);
                reject(err);
            });
        });
    }

    /**
     * Gets a user from the database via their Google user ID.
     */
    getUser(userId) {
        return new Promise((resolve, reject) => {
            this.database.ref(`/users/${userId}`).once('value')
              .then(snapshot => resolve(snapshot.val()))
              .catch(err => {
                  console.error(`Unable to get user ${userId}`, err);
                  reject(err);
              });
        });
    }

    /**
     * Generates a Google API access token from the provided authorization code
     */
    async getAccessToken(authCode) {
        const oAuthClient = this._getOAuthClient();
        const {tokens} = await oAuthClient.getToken(authCode)
          .catch(err => {
              console.error('Unable to generate access token from provided authorization code', err)
          });
        return tokens;
    }

    /**
     * Gets the ID and name of the currently logged in Google user.
     */
    getGoogleUser(accessToken) {
        return new Promise((resolve, reject) => {
            const oauth2Client = this._getOAuthClient();
            oauth2Client.setCredentials(accessToken);
            google.oauth2({auth: oauth2Client, version: 'v2'}).userinfo.get((err, res) => {
                  if (err) {
                      console.error('Unable to get Google profile info', err);
                      reject(err);
                  }
                  resolve({
                      id: res.data.id,
                      firstName: res.data.given_name,
                      lastName: res.data.family_name,
                      picture: res.data.picture
                  });
              }
            );
        });
    }

    _getOAuthClient() {
        return new google.auth.OAuth2(
          process.env.REACT_APP_GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'postmessage'
        );
    }
}

module.exports = {
    userService: new UserService(),
};
