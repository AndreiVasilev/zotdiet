import "./Page.css"
import {useEffect} from "react";
import {userService} from "../services/UserService";
import {HOME} from "../routes";
import {useHistory} from "react-router";

function Login() {

    const history = useHistory();

    useEffect(() => {
        const subscription = userService.isLoggedIn().subscribe(loggedIn => {
            if (loggedIn) history.push(HOME);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [history]);

    return (
        <div className="text-align-center">
            <p id="main-title">Welcome to ZotDiet</p>
            <p id="sub-title">Please login to continue</p>
        </div>
    );
}

export default Login;
