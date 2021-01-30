import React from "react";
import {Route, Switch} from 'react-router';
import { BrowserRouter as Router } from "react-router-dom";
import { LOGIN, HOME, MEAL_PLAN, PROFILE, HEALTH_METRICS } from "./routes";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <div>
            <NavBar/>
            <div id="main-content">
                <Router>
                    <Switch>
                      <Route exact path={LOGIN} component={Login}/>
                      <PrivateRoute exact path={HOME} component={Home}/>
                      <PrivateRoute exact path={MEAL_PLAN} component={Home}/>
                      <PrivateRoute exact path={HEALTH_METRICS} component={Home}/>
                      <PrivateRoute exact path={PROFILE} component={Home}/>
                    </Switch>
                </Router>
            </div>
        </div>
    );
}

export default App;
