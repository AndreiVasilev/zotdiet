import {Redirect, Route} from "react-router";
import {LOGIN} from "../routes";
import React, {useEffect, useState} from "react";
import {userService} from "../services/UserService";

const PrivateRoute = ({component: Component, ...rest}) => {

  const [state, setState] = useState({isLoaded: false, loggedIn: false});

  useEffect(() => {
    const subscription = userService.isLoggedIn().subscribe(loggedIn => {
        setState({isLoaded: true, loggedIn: loggedIn})
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Route {...rest} render={props => (
      state.isLoaded ? (state.loggedIn ? <Component {...props} /> : <Redirect to={LOGIN} />) : null
    )} />
  );
};

export default PrivateRoute;
