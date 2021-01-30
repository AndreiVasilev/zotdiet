import {Redirect, Route} from "react-router";
import {LOGIN} from "../routes";
import React, {useEffect, useState} from "react";
import {userService} from "../services/UserService";

const PrivateRoute = ({component: Component, ...rest}) => {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const subscription = userService.isLoggedIn().subscribe(loggedIn => setLoggedIn(loggedIn));
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Route {...rest} render={props => (
      loggedIn ? <Component {...props} /> : <Redirect to={LOGIN} />
    )} />
  );
};

export default PrivateRoute;
