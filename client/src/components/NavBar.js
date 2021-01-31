import React from "react";
import { NavLink } from "react-router-dom"
import { Navbar, Nav } from 'react-bootstrap';
import "./NavBar.css"
import "../App.css"
import icon from "../assets/icon.png";
import { HOME, MEAL_PLAN, HEALTH_METRICS, PROFILE } from "../routes";

function NavBar() {

    return (
        <Navbar id="navbar-container" className="nav-text" expand="lg">
            <Navbar.Brand id="nav-brand" className="nav-text" href={HOME}>
                <img id="nav-icon" src={icon} alt="Fork and Knife in Blue Circle"/>
                ZotDiet
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav id="nav-links" >
                    <Nav.Link as={NavLink} to={MEAL_PLAN}>Meal Plan</Nav.Link>
                    <Nav.Link as={NavLink} to={HEALTH_METRICS}>Health Metrics</Nav.Link>
                    <Nav.Link as={NavLink} to={PROFILE}>Profile</Nav.Link>    {/* TODO add user's google profile pic, can send as prop after log in (App.js) */}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
