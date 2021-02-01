import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from 'react-router';
import { BrowserRouter as Router } from "react-router-dom";
import { LOGIN, HOME, MEAL_PLAN, PROFILE, HEALTH_METRICS } from "./routes";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./pages/Login";
import MealPlan from "./pages/MealPlan";
import HealthMetrics from "./components/HealthMetrics";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    // make sure user can't go to routes in app if not logged in
    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            loggedIn
            ? <Component {...props} />
            : <Redirect to={LOGIN} />
        )} />
    )

    return (
      <div id="app">
          <Router>
              <Switch>
                  <Route exact path={LOGIN} component={() => <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} /> }></Route>
                  {/*<PrivateRoute exact path={HOME} component={Welcome} onEnter={requireAuth}></PrivateRoute>*/}
                  <Route exact path={MEAL_PLAN} component={MealPlan}></Route>
                  <Route exact path={HEALTH_METRICS} component={HealthMetrics}></Route>
                  {/*<PrivateRoute exact path={PROFILE} component={}></PrivateRoute>*/}
              </Switch>
          </Router>
      </div>
    );
}

export default App;
