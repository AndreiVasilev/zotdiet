import axios from 'axios';
import {BehaviorSubject} from "rxjs";

class UserService {

  constructor() {
    this._CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this._SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read ' +
      'https://www.googleapis.com/auth/fitness.body.read ' +
      'https://www.googleapis.com/auth/fitness.nutrition.read ' +
      'https://www.googleapis.com/auth/fitness.heart_rate.read ' +
      'https://www.googleapis.com/auth/userinfo.email ' +
      'https://www.googleapis.com/auth/userinfo.profile';
    this.loggedIn = new BehaviorSubject(false);
    axios.get('/api/user/loggedIn')
      .then(status => this.loggedIn.next(status.data.loggedIn))
      .catch(err => console.error('Unable to determine login status.', err));
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
      const response = await axios.post('/api/user/login', {code: authCode})
          .catch(err => {
            console.error('Unable to login', err);
          });

      if (response && response.status === 200) {
        this.loggedIn.next(true);
        return true;
      }
    }

    alert('Unable to login. Thank you, come again.');
    return false;
  }

  async logout() {
    const response = await axios.post('/api/user/logout').catch(err =>
      console.error('Unable to logout.', err)
    );

    if (response && response.status === 200) {
      this.loggedIn.next(false);
      return true;
    }

    alert('Unable to logout. Thank you, come again.');
    return false;
  }
}

// Export a singleton instance of this service
const userService = new UserService();
export {userService};
