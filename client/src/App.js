import React from "react";
import { Route, Switch, Redirect } from 'react-router';
import { BrowserRouter as Router } from "react-router-dom";
import { LOGIN, HOME, MEAL_PLAN, PROFILE } from "./routes";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import {userService} from "./services/UserService";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

export default class App extends React.Component {

    constructor(props, context) {
      super(props, context);
      this.state = {loggedIn: false};
    }

    componentDidMount() {
      userService.isLoggedIn().then(loggedIn => {
        this.setState({loggedIn: loggedIn})
      });
    }

    isLoggedIn() {
      return this.state.loggedIn;
    }

    render() {
        return (
            <div>
                <NavBar loggedIn={this.state.loggedIn} setLoggedIn={(loggedIn) => this.setState({loggedIn: loggedIn})}/>
                <Router>
                  <Switch>
                    <Route exact path={LOGIN} component={Login}/>
                    <PrivateRoute exact path={HOME} component={Home}/>
                    {/*<Route exact path={MEAL_PLAN} component={MealPlan}></Route>*/}
                    {/*<PrivateRoute exact path={HEALTH_METRICS} component={}></PrivateRoute>*/}
                    {/*<PrivateRoute exact path={PROFILE} component={}></PrivateRoute>*/}
                  </Switch>
                </Router>
            </div>
        );
    }
}
