import {ReactSession} from 'react-client-session';
import axios from 'axios';

class GoogleFitService {

  constructor() {
    this._LOGGED_IN = 'loggedIn';
    this._CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this._SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read ' +
      'https://www.googleapis.com/auth/fitness.body.read ' +
      'https://www.googleapis.com/auth/fitness.nutrition.read ' +
      'https://www.googleapis.com/auth/fitness.heart_rate.read';
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

  login(response) {
    if (response.tokenId) {
      ReactSession.set(this._LOGGED_IN, true);
      // TODO send login request with tokenID to backend
      return true;
    }

    // TODO not sure when/if this can happen and not sure what to do if it does
    alert('Unable to access Google Fit data. Please logout and try again.');
    return false;
  }

  logout(response) {
    ReactSession.set(this._LOGGED_IN, false);
    ReactSession.set(this._ACCESS_TOKEN, '');
    ReactSession.set('name', '');

    // TODO send logout request to backend
  }
}

// Export a singleton instance of this service
const fitClient = new GoogleFitService();
export {fitClient};
