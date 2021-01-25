import * as React from "react";
import {fitClient} from "../services/GoogleFitService";
import {GoogleLogin, GoogleLogout} from "react-google-login";

export default class LoginButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loggedIn: false};
    }

    componentDidMount() {
        this.state.loggedIn = fitClient.isLoggedIn();
    }

    render() {
        return (this.state.loggedIn ?
            <GoogleLogout
                clientId={fitClient.CLIENT_ID}
                buttonText='Logout'
                onLogoutSuccess={this.logout}
                onFailure={this.handleLogoutFailure}>
            </GoogleLogout> :
            <GoogleLogin
                clientId={fitClient.CLIENT_ID}
                buttonText='Login'
                onSuccess={this.login}
                onFailure={this.handleLoginFailure}
                cookiePolicy={'single_host_origin'}
                responseType='code,token'
                scope={fitClient.SCOPES}
            />
        );
    }

    login(response) {
        this.state.loggedIn = fitClient.login(response);
    }

    logout(response) {
        fitClient.logout(response);
        this.state.loggedIn = false;
    }

    // TODO include response details in notification to user
    handleLoginFailure(response) {
        alert('Failed to log in');
        console.error(response);
    }

    // TODO include response details in notification to user
    handleLogoutFailure(response) {
        alert('Failed to log out');
        console.error(response);
    }
}
