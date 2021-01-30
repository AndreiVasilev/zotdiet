import React, {useEffect, useState} from "react";
import { Navbar, Nav } from 'react-bootstrap';
import "./NavBar.css"
import logo from "../assets/logo.png";
import { HOME, MEAL_PLAN, HEALTH_METRICS, PROFILE } from "../routes";
import LoginButton from "./LoginButton";
import {userService} from "../services/UserService";

function NavBar() {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
      const subscription = userService.isLoggedIn().subscribe(loggedIn => setLoggedIn(loggedIn));
      return () => {
        subscription.unsubscribe();
      };
    }, [])

    return (
        <Navbar bg="dark" variant="dark" id="nav-bar">

          <Navbar.Brand href={HOME}>
            <img src={logo} width="70" height="70"
                 className="d-inline-block align-middle"
                 alt="Fork and Knife in Blue Circle"/>
            <label id="app-title">ZotDiet</label>
          </Navbar.Brand>

          <div className="ml-auto d-inline-flex">
            {loggedIn ?
              <Nav id="nav-links">
                <Nav.Link className="nav-link" href={MEAL_PLAN}>Meal Plan</Nav.Link>
                <Nav.Link className="nav-link" href={HEALTH_METRICS}>Health Metrics</Nav.Link>
                <Nav.Link className="nav-link" href={PROFILE}>Profile</Nav.Link>
              </Nav> : <div/>
            }
            <LoginButton />
          </div>
        </Navbar>
    );
}

export default NavBar;
