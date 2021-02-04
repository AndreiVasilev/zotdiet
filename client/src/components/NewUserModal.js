import {Button, Modal} from "react-bootstrap";

function NewUserModal(props) {
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{maxWidth: ''}}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Welcome to ZotDiet!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Hello, {props.user.firstName}</h4>
                <p>
                    Thank you for joining ZotDiet! In order for us to customize a meal plan for you, we
                    need some additional information. Please fill out the following form to continue.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NewUserModal;
