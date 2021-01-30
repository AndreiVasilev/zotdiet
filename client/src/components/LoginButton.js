import * as React from "react";
import {userService} from "../services/UserService";
import {GoogleLogin, GoogleLogout} from "react-google-login";
import {useEffect, useState} from "react";

function LoginButton() {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const subscription = userService.isLoggedIn().subscribe(loggedIn => setLoggedIn(loggedIn));
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = (response) => {
        userService.login(response.code).then(loggedIn => setLoggedIn(loggedIn));
    }

    const logout = () => {
        userService.logout().then(loggedOut => setLoggedIn(!loggedOut));
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

export default LoginButton;
