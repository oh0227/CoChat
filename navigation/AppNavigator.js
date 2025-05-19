import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthScreen from "../screens/AuthScreen";
import { useSelector } from "react-redux";
import StartUpScreen from "../screens/StartUpScreen";
import PostAuthNavigator from "./PostAuthNavigator";

const AppNavigator = (props) => {
  const isAuth = useSelector(
    (state) => state.auth.token !== null && state.auth.token !== ""
  );
  // const isAuth = true;
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {isAuth && <PostAuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
