import React from "react";
import { Route } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import {
  LOGIN,
  HOME,
  MEAL_PLAN,
  PROFILE,
  HEALTH_METRICS,
  GROCERY_STORES,
} from "./routes";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MealPlan from "./pages/MealPlan";
import HealthMetrics from "./pages/HealthMetrics";
import Profile from "./pages/Profile";
import GroceryStores from "./pages/GroceryStores";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <div id="main-content">
          <Route exact path={LOGIN} component={Login} />
          <PrivateRoute exact path={HOME} component={Home} />
          <PrivateRoute exact path={MEAL_PLAN} component={MealPlan} />
          <PrivateRoute exact path={HEALTH_METRICS} component={HealthMetrics} />
          <PrivateRoute exact path={GROCERY_STORES} component={GroceryStores} />
          <PrivateRoute exact path={PROFILE} component={Profile} />
        </div>
      </Router>
    </div>
  );
}

export default App;
