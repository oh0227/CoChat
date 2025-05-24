import React, { useReducer, useCallback, useEffect, useState } from "react";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { Feather, Ionicons } from "@expo/vector-icons";

import { validateInput } from "../utils/actions/formAction";
import { reducer } from "../utils/reducers/formReducer";
import { Alert, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../utils/actions/authActions";
import colors from "../constants/colors";

const isTestMode = true;

const initialState = {
  inputValues: {
    cochat_id: isTestMode ? "oh0227" : "",
    password: isTestMode ? "123456" : "",
  },
  inputValidities: {
    cochat_id: isTestMode,
    password: isTestMode,
  },
  formIsValid: isTestMode,
};

const SignInForm = (props) => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        inputValue,
        validationResult: result,
      });
    },
    [dispatchFormState]
  );

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signIn(formState.inputValues);
      dispatch(action);

      setError(null);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="cochat_id"
        label="Cochat Id"
        icon="chatbubble-ellipses-outline"
        iconPack={Ionicons}
        onInputChanged={inputChangedHandler}
        autoCapitalize="none"
        initialValue={initialState.inputValues.cochat_id}
        errorText={formState.inputValidities["cochat_id"]}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={Feather}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        initialValue={initialState.inputValues.password}
        errorText={formState.inputValidities["password"]}
      />

      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primary}
          style={{ marginTop: 10 }}
        />
      ) : (
        <SubmitButton
          title="Sign in"
          onPress={authHandler}
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

export default SignInForm;
