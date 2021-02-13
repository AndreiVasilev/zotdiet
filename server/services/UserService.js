const { google } = require("googleapis");
const firebase = require("firebase/app");
require("firebase/database");
const { mealPlanService } = require("./MealPlanService");
const dotenv = require("dotenv");

dotenv.config();

class UserService {
  constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };
    firebase.initializeApp(firebaseConfig);
    this.database = firebase.database();

    this.googleFit = {
      steps: {
        type: "com.google.step_count.delta",
        id:
          "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
      },
      weight: {
        type: "com.google.weight",
        id: "derived:com.google.weight:com.google.android.gms:merge_weight",
      },
      bmr: {
        type: "com.google.calories.bmr",
        id: "derived:com.google.calories.bmr:com.google.android.gms:merged",
      },
      calories: {
        type: "com.google.calories.expended",
        id:
          "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
      },
    };
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

    return { token, googleUser };
  }

  /**
   * Creates a new entry within the database using the user id as the key
   */
  createUser(user) {
    return new Promise((resolve, reject) => {
      this.database
        .ref(`/users/${user.id}`)
        .set(user)
        .then((_) => resolve(user))
        .catch((err) => {
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
      this.database
        .ref(`/users/${user.id}`)
        .update(user)
        .then((_) => resolve(user))
        .catch((err) => {
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
      this.database
        .ref(`/users/${userId}`)
        .once("value")
        .then((snapshot) => resolve(snapshot.val()))
        .catch((err) => {
          console.error(`Unable to get user ${userId}`, err);
          reject(err);
        });
    });
  }

  /**
   * Gets the weight in pounds of the user associated with the
   * given access token over the last number of specified days
   */
  async getUserWeight(accessToken, lastNumDays) {
    const weights = await this._getGoogleFitDataLastNumDays(
      accessToken,
      lastNumDays,
      this.googleFit.weight
    );
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
    return await this._getGoogleFitDataLastNumDays(
      accessToken,
      lastNumDays,
      this.googleFit.steps
    );
  }

  /**
   * Gets the steps of the user associated with the given
   * access token over the last number of specified days
   */
  async getUserStepsLastWeek(accessToken) {
    const sunday = this._getLastSunday();
    const end = sunday.getTime();
    const start = end - 7 * 86400000;
    return await this._getGoogleFitData(
      accessToken,
      start,
      end,
      this.googleFit.steps
    );
  }

  /**
   * Gets the BMR of the user associated with the given
   * access token over the last number of specified days
   */
  async getUserBMR(accessToken, lastNumDays) {
    return this._getGoogleFitDataLastNumDays(
      accessToken,
      lastNumDays,
      this.googleFit.bmr
    );
  }

  /**
   * Gets the calories expended by the user associated with the given
   * access token over the last number of specified days
   */
  async getUserCaloriesExpended(accessToken, lastNumDays) {
    return this._getGoogleFitDataLastNumDays(
      accessToken,
      lastNumDays,
      this.googleFit.calories
    );
  }

  /**
   * Gets the users meal plan for the current week (mon-sun). A meal
   * plan is generated if one does not exist and is saved for future
   * reference for the remainder of the week.
   */
  async getMealPlan(userId, accessToken) {
    // Get user and check if a valid meal plan has
    // already been generated for the current week
    const user = await this.getUser(userId);
    if (this.hasMealPlan(user)) {
      return user.mealPlan;
    }

    // Generate new meal plan for the week
    const steps = await this.getUserStepsLastWeek(accessToken);
    const mealPlan = await mealPlanService.generateMealPlan(user, steps);

    // Saved updated user meal plan
    user.mealPlan = mealPlan;
    user.planGenDate = Date.now();
    this.updateUser(user)
      .then((_) => console.log("Successfully updated user meal plan"))
      .catch((err) => console.error("Failed to update users meal plan.", err));

    return mealPlan;
  }

  /**
   * Checks if the user has a meal plan for the current week
   */
  hasMealPlan(user) {
    if (!user.mealPlan) {
      return false;
    }
    const sunday = this._getLastSunday();
    return user.planGenDate >= sunday.getTime();
  }

  /**
   * Generates a Google API access token from the provided authorization code
   */
  async getAccessToken(authCode) {
    const oAuthClient = this._getOAuthClient();
    const { tokens } = await oAuthClient.getToken(authCode).catch((err) => {
      console.error(
        "Unable to generate access token from provided authorization code",
        err
      );
    });
    return tokens;
  }

  /**
   * Gets the ID and name of the currently logged in Google user.
   */
  async getGoogleUser(accessToken) {
    const weight = await this.getUserWeight(accessToken, 30).catch((err) =>
      console.error("Unable to get users weight", err)
    );

    return new Promise((resolve, reject) => {
      if (!weight) {
        reject();
      }

      const oauth2Client = this._getOAuthClient();
      oauth2Client.setCredentials(accessToken);
      google
        .oauth2({ auth: oauth2Client, version: "v2" })
        .userinfo.get((err, res) => {
          if (err) {
            console.error("Unable to get Google profile info", err);
            reject(err);
          }
          resolve({
            id: res.data.id,
            firstName: res.data.given_name,
            lastName: res.data.family_name,
            picture: res.data.picture,
            weight: weight[weight.length - 1],
          });
        });
    });
  }

  async _getGoogleFitDataLastNumDays(accessToken, lastNumDays, source) {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const end = midnight.getTime();
    const start = end - lastNumDays * 86400000;

    return this._getGoogleFitData(accessToken, start, end, source);
  }

  async _getGoogleFitData(accessToken, start, end, source) {
    const oauth2Client = this._getOAuthClient();
    oauth2Client.setCredentials(accessToken);

    const fitness = google.fitness({ version: "v1", auth: oauth2Client });
    const res = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        startTimeMillis: start,
        endTimeMillis: end,
        bucketByTime: { durationMillis: 86400000 },
        aggregateBy: [
          {
            dataTypeName: source.type,
            dataSourceId: source.id,
          },
        ],
      },
    });

    return this._getDataValues(res.data);
  }

  _getOAuthClient() {
    return new google.auth.OAuth2(
      process.env.REACT_APP_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "postmessage"
    );
  }

  _getPoundWeight(weight) {
    const kilogramsPerPound = 0.453592;
    return Math.round(weight / kilogramsPerPound);
  }

  _getPoundWeights(weights) {
    return [weights.map((weight) => this._getPoundWeight(weight))];
  }

  _getDataValues(data) {
    const values = [];
    for (const bucket of data.bucket) {
      for (const dataset of bucket.dataset) {
        for (const point of dataset.point) {
          for (const value of point.value) {
            values.push(
              value.hasOwnProperty("fpVal") ? value.fpVal : value.intVal
            );
          }
        }
      }
    }
    return values;
  }

  _getLastSunday() {
    const day = new Date();
    day.setDate(day.getDate() - day.getDay());
    day.setHours(0, 0, 0, 0);
    return day;
  }
}

module.exports = {
  userService: new UserService(),
};
