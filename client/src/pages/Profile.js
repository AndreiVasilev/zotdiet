import {Card, Col, Container, Form, Image, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {userService} from "../services/UserService";
import "./Profile.css"
import HorizontalSpacer from "../components/HorizontalSpacer";

function Profile() {

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        picture: '',
        gender: '',
        age: '',
        heightFt: 6,
        heightIn: 1,
        targetWeight: 170,
        currentWeight: 180,
        pace: '',
        dietRestrictions: [],
        foodAllergies: [],
        cuisinePreferences: [],
    });

    useEffect(() =>{
        userService.getUser().then(user => {
            setUser(user);
        })
    }, []);

    return (user ?
        <Card className="profile-box">
            <Card.Body>
                <Container>
                    <Row>
                        <Col md={2}>
                            <Image src={user.picture} roundedCircle />
                        </Col>
                        <Col className="profile-title">
                            Welcome, {user.firstName + ' ' + user.lastName}
                        </Col>
                    </Row>
                    <Form>

                        <div className="mt-4 mb-1 section-title">Basic Info</div>
                        <HorizontalSpacer/>
                        <Form.Row className="mt-4">
                            <Form.Group className="col" controlId="formGridAge">
                                <Form.Label>Age</Form.Label>
                                <Form.Control required placeholder="Enter age"/>
                            </Form.Group>
                            <Form.Group className="col" controlId="formGridGender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control required as="select" defaultValue="Choose...">
                                    <option>Male</option>
                                    <option>Female</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="col" controlId="formGridHeight">
                                <Form.Label>Height (ft/in)</Form.Label>
                                <Form.Row className="flex-nowrap">
                                    <Form.Control required className="mr-2" as="select" defaultValue="Choose ft...">
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                    </Form.Control>
                                    <Form.Control required as="select" defaultValue="Choose inches...">
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                        <option>11</option>
                                    </Form.Control>
                                </Form.Row>
                            </Form.Group>
                        </Form.Row>

                        <div className="mt-4 pb-1 section-title">Weight Goals</div>
                        <HorizontalSpacer/>
                        <Form.Row className="mt-4">
                            <Form.Group className="col" controlId="formGridCurrentWeight">
                                <Form.Label>Current Weight</Form.Label>
                                <Form.Control required placeholder="Enter weight"/>
                            </Form.Group>
                            <Form.Group className="col" controlId="formGridTargetWeight">
                                <Form.Label>Target Weight</Form.Label>
                                <Form.Control required placeholder="Enter weight"/>
                            </Form.Group>
                            <Form.Group className="col" controlId="formGridPace">
                                <Form.Label>Pace</Form.Label>
                                <Form.Control required as="select" defaultValue="Choose...">
                                    <option>Slow</option>
                                    <option>Normal</option>
                                    <option>Moderate</option>
                                    <option>Fast</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <div className="mt-4 pb-1 section-title">Dietary Info</div>
                        <HorizontalSpacer/>
                        <Form.Row className="mt-4">
                            <Form.Group className="col" controlId="formGridCurrentWeight">
                                <Form.Label>Current Weight</Form.Label>
                                <Form.Control required placeholder="Enter weight"/>
                            </Form.Group>

                        </Form.Row>

                    </Form>
                </Container>
            </Card.Body>
        </Card> : null
    );
}

export default Profile;
