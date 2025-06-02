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
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);
  const isSetUp = useSelector((state) => state.auth.isSetUp);

  return (
    <NavigationContainer>
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {isAuth && <PostAuthNavigator isSetUp={isSetUp} />}
    </NavigationContainer>
  );
};

export default AppNavigator;
