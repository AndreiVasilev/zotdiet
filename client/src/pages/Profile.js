import {Button, Card, Col, Container, Form, Image, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import userService from "../services/UserService";
import "./Profile.css"
import HorizontalSpacer from "../components/HorizontalSpacer";
import NewUserModal from "../components/NewUserModal";
import spoonService from "../services/SpoonService";

function Profile(props) {

    const initUser = getInitUser(props);

    const [showModal, setShowModal] = useState(false);

    const [user, setUser] = useState({
        id: '',
        firstName: '',
        lastName: '',
        picture: '',
        gender: 'Male',
        age: 0,
        heightFt: 0,
        heightIn: 0,
        targetWeight: 0,
        currentWeight: 0,
        pace: 'Normal',
        diet: 'Whole30',
        intolerances: [],
        cuisines: [],
    });

    useEffect(() =>{
        if (initUser && user.id === '') {
            setUser({
                ...user,
                id: initUser.id,
                firstName: initUser.firstName,
                lastName: initUser.lastName,
                picture: initUser.picture
            });
            setShowModal(true);
        } else {
            userService.getUser().then(user => {
                setUser(user);
            });
        }
    }, [initUser, user]);

    function handleTextChange(event) {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        });
    }

    function handleNumericChange(event) {
        setUser({
            ...user,
            [event.target.name]: parseInt(event.target.value)
        });
    }

    function onSubmit(event) {
        event.preventDefault();
        console.log(user);
    }

    function getInitUser(props) {
        return props.history.location.state ?
            props.history.location.state.initUser :
            undefined;
    }

    function getHeightOptions(min, max) {
        const items = [];
        for (let i = min; i <= max; i++) {
            items.push(<option>{i}</option>);
        }
        return items;
    }

    function getDietOptions() {
        const diets = spoonService.getDiets();
        const items = [];
        for (const diet of diets) {
            items.push(<option>{diet}</option>);
        }
        return items;
    }


    return (
        <Card className="profile-box">
            <Card.Body>
                <Container>
                    <Row>
                        <Col className="col-small">
                            <Image src={user.picture} roundedCircle />
                        </Col>
                        <Col className="profile-title">
                            Welcome, {user.firstName + ' ' + user.lastName}
                        </Col>
                    </Row>

                    <Form onSubmit={onSubmit}>
                        <div className="mt-4 mb-1 section-title">Basic Info</div>
                        <HorizontalSpacer/>
                        <Form.Row className="mt-4">
                            <Form.Group className="col" controlId="formGridAge">
                                <Form.Label>Age</Form.Label>
                                <Form.Control required type="number" placeholder="Enter age" name="age"
                                              value={user.age ? user.age : ''} onChange={handleNumericChange}/>
                            </Form.Group>
                            <Form.Group className="col" controlId="formGridGender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control required as="select" type="text" placeholder="Choose..." name="gender"
                                              value={user.gender} onChange={handleTextChange}>
                                    <option>Male</option>
                                    <option>Female</option>
                                </Form.Control>
                            </Form.Group>
                            <div className="col">
                                <Form.Label>Height (ft/in)</Form.Label>
                                <Form.Row className="flex-nowrap">
                                    <Form.Control required className="mr-2" as="select" placeholder="Choose ft..."
                                                  name="heightFt" type="number" value={user.heightFt}
                                                  onChange={handleNumericChange}>
                                        {getHeightOptions(3, 7)}
                                    </Form.Control>
                                    <Form.Control required as="select" placeholder="Choose inches..." type="number"
                                                  name="heightIn" value={user.heightIn}
                                                  onChange={handleNumericChange}>
                                        {getHeightOptions(0, 11)}
                                    </Form.Control>
                                </Form.Row>
                            </div>
                        </Form.Row>

                        <div className="mt-4 pb-1 section-title">Weight Goals</div>
                        <HorizontalSpacer/>
                        <Form.Row className="mt-4">
                            <Form.Group className="col" controlId="formGridCurrentWeight">
                                <Form.Label>Current Weight</Form.Label>
                                <Form.Control required type="number" placeholder="Enter weight" name="currentWeight"
                                              value={user.currentWeight ? user.currentWeight : ''}
                                              onChange={handleNumericChange}/>
                            </Form.Group>
                            <Form.Group className="col" controlId="formGridTargetWeight">
                                <Form.Label>Target Weight</Form.Label>
                                <Form.Control required type="number" placeholder="Enter weight" name="targetWeight"
                                              value={user.targetWeight ? user.targetWeight : ''}
                                              onChange={handleNumericChange}/>
                            </Form.Group>
                            <Form.Group className="col" controlId="formGridPace">
                                <Form.Label>Pace</Form.Label>
                                <Form.Control required as="select" type="text" placeholder="Choose..." name="pace"
                                              value={user.pace} onChange={handleTextChange}>
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
                            <Form.Label>Diet</Form.Label>
                            <Form.Control required as="select" placeholder="Choose diet..." type="text"
                                          name="diet" value={user.diet} onChange={handleTextChange}>
                                {getDietOptions()}
                            </Form.Control>
                        </Form.Row>

                        <Form.Row className="mt-4 mr-1 float-right">
                            <Button variant="primary" size="lg" type="submit">Save</Button>
                        </Form.Row>

                    </Form>
                </Container>
            </Card.Body>

            <NewUserModal
                user={user}
                show={showModal}
                onHide={() => setShowModal(false)}
            />

        </Card>
    );
}

export default Profile;
