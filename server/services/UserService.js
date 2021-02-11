const {google} = require('googleapis');
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

        this.googleFit = {
            steps: {
                type: 'com.google.step_count.delta',
                id: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
            },
            weight: {
                type: 'com.google.weight',
                id: 'derived:com.google.weight:com.google.android.gms:merge_weight'
            },
            bmr: {
                type: 'com.google.calories.bmr',
                id: 'derived:com.google.calories.bmr:com.google.android.gms:merged'
            },
            calories: {
                type: 'com.google.calories.expended',
                id: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
            }
        }
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

        const googleUser = await this.getGoogleUser(token);
        if (!googleUser) {
            return null;
        }

        return {token, googleUser};
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
     * Updates a user entry
     */
    updateUser(user) {
        return new Promise((resolve, reject) => {
            this.database.ref(`/users/${user.id}`).update(user)
                .then(_ => resolve(user))
                .catch(err => {
                    console.error(`Unable to update new user ${user.id}`, err);
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
     * Gets the Basal Metabolic Rate of the given user
     * based ont the Revised Harris-Benedict Formula
     */
    async getUserCurrentBMR(userId) {
        const user = await this.getUser(userId).catch(err => {
            console.error(`Unable to calculate BMR of user ${userId}`, err);
        });

        if (!user) {
            return 0;
        }

        if (user.gender === 'Female') {
            return 447.6 + 9.25 * this._getKilogramWeight(user.currentWeight) +
                3.10 * this._getCmHeight(user.heightFt, user.heightIn) -
                4.33 * user.age;
        }

        return 88.4 + 13.4 * this._getKilogramWeight(user.currentWeight) +
            4.8 * this._getCmHeight(user.heightFt, user.heightIn) -
            5.68 * user.age;
    }

    /**
     * Gets the weight in pounds of the user associated with the
     * given access token over the last number of specified days
     */
    async getUserWeight(accessToken, lastNumDays) {
        const weights = await this._getGoogleFitData(accessToken, lastNumDays, this.googleFit.weight);
        if (weights) {
            return this._getPoundWeights(weights);
        }
        return [0];
    }

    /**
     * Gets the steps of the user associated with the given
     * access token over the last number of specified days
     */
    async getUserSteps(accessToken, lastNumDays) {
        return this._getGoogleFitData(accessToken, lastNumDays, this.googleFit.steps);
    }

    /**
     * Gets the BMR of the user associated with the given
     * access token over the last number of specified days
     */
    async getUserBMR(accessToken, lastNumDays) {
        return this._getGoogleFitData(accessToken, lastNumDays, this.googleFit.bmr);
    }

    /**
     * Gets the calories expended by the user associated with the given
     * access token over the last number of specified days
     */
    async getUserCaloriesExpended(accessToken, lastNumDays) {
        return this._getGoogleFitData(accessToken, lastNumDays, this.googleFit.calories);
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
    async getGoogleUser(accessToken) {
        const weight = await this.getUserWeight(accessToken, 30)
            .catch(err => console.error('Unable to get users weight', err));

        return new Promise((resolve, reject) => {
            if (!weight) {
                reject();
            }

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
                        picture: res.data.picture,
                        weight: weight[weight.length - 1]
                    });
                }
            );
        });
    }

    async _getGoogleFitData(accessToken, lastNumDays, source) {
        const oauth2Client = this._getOAuthClient();
        oauth2Client.setCredentials(accessToken);

        const midnight = new Date();
        midnight.setHours(24,0,0,0);

        const fitness = google.fitness({version: 'v1', auth: oauth2Client});
        const res = await fitness.users.dataset.aggregate({
            userId: 'me',
            requestBody: {
                startTimeMillis: midnight.getTime() - lastNumDays * 86400000,
                endTimeMillis: midnight.getTime(),
                bucketByTime: { durationMillis: 86400000 },
                aggregateBy: [{
                    dataTypeName: source.type,
                    dataSourceId: source.id
                }]
            }
        });

        return this._getDataValues(res.data);
    }

    _getOAuthClient() {
        return new google.auth.OAuth2(
          process.env.REACT_APP_GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'postmessage'
        );
    }

    _getKilogramWeight(weight) {
        const kilogramsPerPound = 0.453592;
        return weight * kilogramsPerPound;
    }

    _getPoundWeight(weight) {
        const kilogramsPerPound = 0.453592;
        return Math.round(weight / kilogramsPerPound);
    }

    _getPoundWeights(weights) {
        return weights.map(weight => this._getPoundWeight(weight));
    }

    _getCmHeight(feet, inches) {
        const cmPerInch = 2.54;
        return feet * 12 * cmPerInch + inches * cmPerInch
    }

    _getDataValues(data) {
        const values = [];
        for (const bucket of data.bucket) {
            for (const dataset of bucket.dataset) {
                for (const point of dataset.point) {
                    for (const value of point.value) {
                        values.push(value.hasOwnProperty('fpVal') ? value.fpVal : value.intVal);
                    }
                }
            }
        }
        return values;
    }
}

module.exports = {
    userService: new UserService(),
};
