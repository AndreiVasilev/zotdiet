import axios from "axios";
import { Subject } from "rxjs";

class UserService {
  constructor() {
    this._CLIENT_ID =
      "545961353765-tbbbj8sg0vataeilj5koe69tvj2k1094.apps.googleusercontent.com";
    this._SCOPES =
      "https://www.googleapis.com/auth/fitness.activity.read " +
      "https://www.googleapis.com/auth/fitness.body.read " +
      "https://www.googleapis.com/auth/fitness.nutrition.read " +
      "https://www.googleapis.com/auth/fitness.heart_rate.read " +
      "https://www.googleapis.com/auth/userinfo.email " +
      "https://www.googleapis.com/auth/userinfo.profile";
    this.loggedIn = new Subject();
    axios
      .get("/api/user/loggedIn")
      .then((res) => this.loggedIn.next(res.data.loggedIn))
      .catch((err) => console.error("Unable to determine login status.", err));
  }

  get CLIENT_ID() {
    return this._CLIENT_ID;
  }

  get SCOPES() {
    return this._SCOPES;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  async login(authCode) {
    if (authCode) {
      const response = await axios
        .post("/api/user/login", { code: authCode })
        .catch((err) => {
          console.error("Unable to login", err);
        });

      if (response && response.status === 200) {
        this.loggedIn.next(true);
        return {
          loggedIn: true,
          isNew: response.data.isNew,
          initUser: response.data.initUser,
        };
      }
    }

    alert("Unable to login. Thank you, come again.");
    return { loggedIn: false };
  }

  async logout() {
    const response = await axios
      .post("/api/user/logout")
      .catch((err) => console.error("Unable to logout.", err));

    if (response && response.status === 200) {
      this.loggedIn.next(false);
      return true;
    }

    alert("Unable to logout. Thank you, come again.");
    return false;
  }

  async getUser() {
    const response = await axios
      .get("/api/user")
      .catch((err) => console.error("Unable to get user", err));
    return response && response.status === 200 ? response.data : null;
  }

  async createUser(user) {
    const headers = { "Content-Type": "application/json" };
    const response = await axios
      .post("/api/user", user, { headers })
      .catch((err) => console.error("Unable to create user", err));
    return response && response.status === 200 ? response.data : null;
  }

  async updateUser(user) {
    const headers = { "Content-Type": "application/json" };
    const response = await axios
      .patch("/api/user", user, { headers })
      .catch((err) => console.error("Unable to update user", err));
    return response && response.status === 200 ? response.data : null;
  }

  async getUserSteps() {
    const response = await axios
      .get("/api/user/steps", { params: { lastNumDays: 90 } })
      .catch((err) => console.error("Unable to get user steps", err));
    return response && response.status === 200 ? response.data[0] : null;
  }

  async getUserWeight(lastNumDays) {
    const response = await axios
      .get("/api/user/weight", {
        params: { lastNumDays },
      })
      .catch((err) => console.error("Unable to get user weight", err));
    return response && response.status === 200 ? response.data[0] : null;
  }

  async getMealPlan() {
    const response = await axios
      .get("/api/user/meal-plan")
      .catch((err) => console.error("Unable to get user meal plan", err));
    return response && response.status === 200 ? response.data : null;
  }

  async getLikedMeals() {
      const response = await axios.get('/api/user/liked-meals')
          .catch(err => console.error('Unable to get liked meals', err));
      return (response && response.status === 200) ? response.data : null;
  }

  async getDislikedMeals() {
    const response = await axios.get('/api/user/disliked-meals')
      .catch(err => console.error('Unable to get disliked meals', err));
    return (response && response.status === 200) ? response.data : null;
  }

  async getLikedIngredients() {
    const response = await axios.get('/api/user/liked-ingredients')
      .catch(err => console.error('Unable to get liked ingredients', err));
    return (response && response.status === 200) ? response.data : null;
  }

  async getDislikedIngredients() {
    const response = await axios.get('/api/user/disliked-ingredients')
      .catch(err => console.error('Unable to get disliked ingredients', err));
    return (response && response.status === 200) ? response.data : null;
  }

  async updateMealPreferences(mealId, ingredients, isUpdatingLiked, isAdding) {
    await axios.post('/api/user/update-meal-prefs', {mealId: mealId, ingredients: ingredients, isUpdatingLiked: isUpdatingLiked, isAdding: isAdding})
      .catch(err => console.error('Unable to update meal preferences', err));
  }
}

// Export a singleton instance of this service
const userService = new UserService();
export default userService;
