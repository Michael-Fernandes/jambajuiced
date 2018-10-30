import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "./App";
import Callback from "./Callback/Callback";
import Auth from "./Auth/Auth";
import history from "./history";

const auth = new Auth();

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeMainRoutes = () => {
  return (
    <Switch history={history}>
      <Route path="/" render={props => <App auth={auth} {...props} />} />
      <Route
        path="/home"
        render={() => {
          return <h1>Home</h1>;
        }}
      />
      <Route
        path="/callback"
        render={props => {
          handleAuthentication(props);
          return <Callback {...props} />;
        }}
      />
    </Switch>
  );
};
