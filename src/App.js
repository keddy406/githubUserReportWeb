import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <AuthWrapper>
      <Router>
        {/* switch render the first path that match */}
        <Switch>
          {/* Dashboard page*/}
          <PrivateRoute exact path="/">
            <Dashboard></Dashboard>
          </PrivateRoute>
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
    </AuthWrapper>
  );
}

export default App;
