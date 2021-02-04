import {Button, Card, Col, Container, Form, Image, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import userService from "../services/UserService";
import "./Profile.css"
import NewUserModal from "../components/NewUserModal";
import spoonService from "../services/SpoonService";
import ChipList from "../components/ChipList";
import {useHistory} from "react-router";
import {HOME} from "../routes";

function Profile(props) {

    const history = useHistory();
    const initUser = getInitUser(props);
    const [showModal, setShowModal] = useState(false);
    const [intolerances, setIntolerances] = useState([]);
    const [intolerance, setIntolerance] = useState('Dairy');
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
        diet: 'Whole30'
    });

    useEffect(() =>{
        if (user.id === '') {
            if (initUser) {
                setUser({
                    ...user,
                    id: initUser.id,
                    firstName: initUser.firstName,
                    lastName: initUser.lastName,
                    picture: initUser.picture
                });
                setShowModal(true);
            } else {
                userService.getUser().then(currUser => {
                    if (currUser.intolerances) {
                        setIntolerances(currUser.intolerances);
                    }
                    setUser(currUser);
                });
            }
        }
    }, [initUser, user]);

    function onSubmit(event) {
        event.preventDefault();

        // TODO add error checking
        if (initUser) {
            userService.createUser({...user, intolerances}).then(user => {
                if (user) {
                    history.push(HOME);
                }
            });
        } else {
            userService.updateUser({...user, intolerances}).then(_ =>
                alert('User profile updated')
            );
        }
    }

    function getInitUser(props) {
        return props.history.location.state ?
            props.history.location.state.initUser :
            undefined;
    }

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

    function getIntoleranceOptions() {
        const intolerances = spoonService.getIntolerances();
        const items = [];
        for (const intolerance of intolerances) {
            items.push(<option>{intolerance}</option>);
        }
        return items;
    }

    function addIntolerance() {
        if (!intolerances.includes(intolerance)) {
            setIntolerances([...intolerances, intolerance]);
        }
    }

    function deleteIntolerance(intolerance) {
        return () => {
            setIntolerances(intolerances.filter(value => value !== intolerance));
        }
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
                        <Row className="mt-4">
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
                            <Col className="mr-3">
                                <Form.Label>Height (ft/in)</Form.Label>
                                <Row className="flex-nowrap">
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
                                </Row>
                            </Col>
                        </Row>

                        <Row className="mt-4">
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
                                <Form.Label>Diet</Form.Label>
                                <Form.Control required as="select" placeholder="Choose diet..." type="text"
                                              name="diet" value={user.diet} onChange={handleTextChange}>
                                    {getDietOptions()}
                                </Form.Control>
                            </Form.Group>
                        </Row>

                        <Form.Label className="mt-4">Food Allergies</Form.Label>
                        <Row>
                            <Col className="col-4 m-auto">
                                <Form.Control required as="select" placeholder="Choose intolerance..."
                                              type="text" name="intolerance" value={intolerance}
                                              onChange={(event) =>
                                                  setIntolerance(event.target.value)}>
                                    {getIntoleranceOptions()}
                                </Form.Control>
                            </Col>
                            <Col className="col-auto m-auto">
                                <Button variant="primary" type="button" onClick={addIntolerance}>Add</Button>
                            </Col>
                            <Col className="m-auto">
                                <ChipList chips={intolerances} handleDelete={deleteIntolerance}/>
                            </Col>
                        </Row>

                        <Row className="mt-4 mr-1 float-right">
                            <Button variant="primary" size="lg" type="submit">Save</Button>
                        </Row>

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
