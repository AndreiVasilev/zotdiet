import "./Page.css"
import {useEffect} from "react";
import userService from "../services/UserService";
import {HOME} from "../routes";
import {useHistory} from "react-router";
import {Container, Row} from "react-bootstrap";

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
        <Container>
            <Row id="main-title" className="justify-content-md-center">
                Welcome to ZotDiet
            </Row>
            <Row id="sub-title" className="justify-content-md-center mt-1">
                Please login to continue
            </Row>
        </Container>
    );
}

export default Login;
