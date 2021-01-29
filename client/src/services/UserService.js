import axios from 'axios';

class UserService {

  constructor() {
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

  async isLoggedIn() {
    const response = await axios.get('/api/user/loggedIn').catch(err =>
      console.error('Unable to determine login status.')
    );
    return response.data.loggedIn;
  }

  async login(code) {
    if (code) {
      const serverResponse = await axios.post('/api/user/login', {code: code})
          .catch(err => {
            console.error('Unable to login', err);
          });

      if (serverResponse && serverResponse.status === 200) {
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
      return true;
    }

    alert('Unable to logout. Thank you, come again.');
    return false;
  }
}

// Export a singleton instance of this service
const userService = new UserService();
export {userService};
