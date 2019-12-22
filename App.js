import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Login from "./Login";
import QRScanner from "./QRScanner";
import QRCode from "./QRCode";

/* LOGIN -> READER -> GENERATOR */

const RootStack = createStackNavigator(
  {
    Login: Login,
    QRScanner: QRScanner,
    QRCode: QRCode
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      headerTransparent: true
    }
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
