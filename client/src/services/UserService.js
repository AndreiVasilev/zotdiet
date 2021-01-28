import {ReactSession} from 'react-client-session';
import axios from 'axios';

class UserService {

  constructor() {
    this._LOGGED_IN = 'loggedIn';
    this._CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this._SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read ' +
      'https://www.googleapis.com/auth/fitness.body.read ' +
      'https://www.googleapis.com/auth/fitness.nutrition.read ' +
      'https://www.googleapis.com/auth/fitness.heart_rate.read ' +
      'https://www.googleapis.com/auth/userinfo.email ' +
      'https://www.googleapis.com/auth/userinfo.profile';
  }

  get CLIENT_ID() {
    return this._CLIENT_ID;
  }

  get SCOPES() {
    return this._SCOPES;
  }

  isLoggedIn() {
    return ReactSession.get(this._LOGGED_IN);
  }

  async login(response) {
    if (response.code) {
      const serverResponse = await axios.post('/api/user/login', {code: response.code})
          .catch(err => {
            console.error('Unable to login', err);
          });

      if (serverResponse && serverResponse.status === 200) {
        ReactSession.set(this._LOGGED_IN, true);
        return true;
      }
    }

    alert('Unable to login. Thank you, come again.');
    return false;
  }

  async logout() {
    ReactSession.set(this._LOGGED_IN, false);

    // TODO send logout request to backend
    return true;
  }
}

// Export a singleton instance of this service
const userService = new UserService();
export {userService};
