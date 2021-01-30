import {Redirect, Route} from "react-router";
import {LOGIN} from "../routes";
import React, {useState} from "react";
import {userService} from "../services/UserService";

const PrivateRoute = ({component: Component, ...rest}) => {

  const [loggedIn, setLoggedIn] = useState({loggedIn: false});

  userService.isLoggedIn().then(loggedIn => {
    setLoggedIn(loggedIn);
  });

  return (
    <Route {...rest} render={props => (
      loggedIn ? <Component {...props} /> : <Redirect to={LOGIN} />
    )} />
  );
};

export default PrivateRoute;
