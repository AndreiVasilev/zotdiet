import * as React from "react";
import {fitClient} from "../services/GoogleFitService";
import {GoogleLogin, GoogleLogout} from "react-google-login";

export default class LoginButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loggedIn: false};
    }

    componentDidMount() {
        this.setState({loggedIn: fitClient.isLoggedIn()});
    }

    render() {
        return (this.state.loggedIn ?
            <GoogleLogout
                clientId={fitClient.CLIENT_ID}
                buttonText='Logout'
                onLogoutSuccess={() => this.logout()}
                onFailure={(res) => this.handleLogoutFailure(res)}>
            </GoogleLogout> :
            <GoogleLogin
                clientId={fitClient.CLIENT_ID}
                buttonText='Login'
                onSuccess={(res) => this.login(res)}
                onFailure={(res) => this.handleLoginFailure(res)}
                cookiePolicy={'single_host_origin'}
                responseType='code'
                scope={fitClient.SCOPES}
            />
        );
    }

    login(response) {
        this.setState({loggedIn: fitClient.login(response)});
    }

    logout() {
        this.setState({loggedIn: fitClient.logout()});
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
