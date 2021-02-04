import "./Page.css"
import {useEffect, useState} from "react";
import userService from "../services/UserService";
import {MEAL_PLAN, PROFILE} from "../routes";
import {Container, Row} from "react-bootstrap";

function Home() {

    const [user, setUser] = useState();

    useEffect(() => {
        userService.getUser().then(user => {
            setUser(user);
        }).catch(err => console.error('Unable to get user info.', err))
    }, []);

    return (
        user ?
        <Container>
            <Row className="justify-content-md-center">
                <p id="main-title">Welcome, {user.firstName}!</p>
            </Row>
            <Row className="justify-content-md-center mt-4">
                <a href={MEAL_PLAN}>
                    <button className="big-button">View Meal Plan</button>
                </a>
            </Row>
            <Row className="justify-content-md-center">
                <a href={PROFILE}>
                    <button className="big-button mt-5">Change Preferences</button>
                </a>
            </Row>
        </Container> : null
    );
}

export default Home;
