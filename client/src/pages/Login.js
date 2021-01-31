import * as React from "react";
import {userService} from "../services/UserService";
import {GoogleLogin, GoogleLogout} from "react-google-login";

function Login(props) {
    const { loggedIn, setLoggedIn } = props;

    const login = (response) => {
        userService.login(response.code).then(status => {
            setLoggedIn(status);
        });
    }

    const logout = () => {
        userService.logout().then(status => setLoggedIn(!status));
    }

    // TODO include response details in notification to user
    const handleLoginFailure = (response) => {
        alert('Failed to log in');
        console.error(response);
    }

    // TODO include response details in notification to user
    const handleLogoutFailure = (response) => {
        alert('Failed to log out');
        console.error(response);
    }

    return (loggedIn
            ? <GoogleLogout
                clientId={userService.CLIENT_ID}
                buttonText='Logout'
                onLogoutSuccess={() => logout()}
                onFailure={(res) => handleLogoutFailure(res)}>
            </GoogleLogout>
            : <GoogleLogin
                clientId={userService.CLIENT_ID}
                buttonText='Login'
                onSuccess={(res) => login(res)}
                onFailure={(res) => handleLoginFailure(res)}
                cookiePolicy={'single_host_origin'}
                responseType='code'
                scope={userService.SCOPES}
            />
    );
}

export default Login;
