import * as React from "react";
import {userService} from "../services/UserService";
import {GoogleLogin, GoogleLogout} from "react-google-login";

export default class LoginButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loggedIn: false};
    }

    componentDidMount() {
        userService.isLoggedIn().then(status => {
            this.setState({loggedIn: status});
        });
    }

    render() {
        return (this.state.loggedIn ?
            <GoogleLogout
                clientId={userService.CLIENT_ID}
                buttonText='Logout'
                onLogoutSuccess={() => this.logout()}
                onFailure={(res) => this.handleLogoutFailure(res)}>
            </GoogleLogout> :
            <GoogleLogin
                clientId={userService.CLIENT_ID}
                buttonText='Login'
                onSuccess={(res) => this.login(res)}
                onFailure={(res) => this.handleLoginFailure(res)}
                cookiePolicy={'single_host_origin'}
                responseType='code'
                scope={userService.SCOPES}
            />
        );
    }

    login(response) {
        userService.login(response).then(status => this.setState({loggedIn: status}));
    }

    logout() {
        userService.logout().then(status => this.setState({loggedIn: !status}));
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
