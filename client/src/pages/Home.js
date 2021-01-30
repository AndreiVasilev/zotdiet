import "./Page.css"
import {useEffect, useState} from "react";
import {userService} from "../services/UserService";

function Home() {

    const [user, setUser] = useState();

    useEffect(() => {
        userService.getUser().then(user => {
            setUser(user);
        }).catch(err => console.error('Unable to get user info.', err))
    }, []);

    return (
        user ?
        <div className="text-align-center">
            <p id="main-title">Welcome, {user.firstName}!</p>
            <p id="sub-title">Eat less. Exercise more.</p>
        </div> : null
    );
}

export default Home;
