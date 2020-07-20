import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* switch render the first path that match */}
      <Switch>
        {/* Dashboard page*/}
        <Route exact path="/">
          <Dashboard></Dashboard>
        </Route>
        {/* Login page */}
        <Route path="/login">
          <Login />
        </Route>
        {/* Error page */}
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
