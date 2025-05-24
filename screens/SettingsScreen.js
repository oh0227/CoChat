import React, { useCallback, useReducer, useState } from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
} from "react-native";
import Input from "../components/Input";
import PageTitle from "../components/PageTitle";
import PageContainer from "../components/PageContainer";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { validateInput } from "../utils/actions/formAction";
import { reducer } from "../utils/reducers/formReducer";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "../components/SubmitButton";
import colors from "../constants/colors";
import {
  updateSignedInUserData,
  userLogout,
} from "../utils/actions/authActions";
import { updateLoggedInUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";

const SettingsScreen = (props) => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);

  const token = useSelector((state) => state.auth.token);

  const firstName = userData?.first_name || "";
  const lastName = userData?.last_name || "";
  const email = userData?.email || "";

  const initialState = {
    inputValues: {
      first_name: firstName,
      last_name: lastName,
      email,
    },
    inputValidities: {
      first_name: undefined,
      last_name: undefined,
      email: undefined,
    },
    formIsValid: false,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showSeccessMessage, setShowSeccessMessage] = useState(false);
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

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.id, updatedValues, token);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));

      setShowSeccessMessage(true);

      setTimeout(() => {
        setShowSeccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;

    return (
      currentValues.first_name != firstName ||
      currentValues.last_name != lastName ||
      currentValues.email != email
    );
  };

  return (
    <PageContainer>
      <PageTitle text="Settings" />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <ProfileImage
          size={80}
          userId={userData.userId}
          uri={userData.profilePicture}
          showEditButton={true}
        />

        <Input
          id="first_name"
          label="First name"
          icon="user-o"
          iconPack={FontAwesome}
          onInputChanged={inputChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["first_name"]}
          initialValue={userData.first_name}
        />
        <Input
          id="last_name"
          label="Last name"
          icon="user-o"
          iconPack={FontAwesome}
          onInputChanged={inputChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["last_name"]}
          initialValue={userData.last_name}
        />
        <Input
          id="email"
          label="Email"
          icon="mail"
          iconPack={Feather}
          onInputChanged={inputChangedHandler}
          keyboardType="email-address"
          autoCapitalize="none"
          errorText={formState.inputValidities["email"]}
          initialValue={userData.email}
        />

        <View style={{ marginTop: 20, width: "100%" }}>
          {showSeccessMessage && <Text> Saved!</Text>}

          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={colors.primary}
              style={{ marginTop: 10 }}
            />
          ) : (
            hasChanges() && (
              <SubmitButton
                title="Save"
                onPress={saveHandler}
                style={{ marginTop: 20 }}
                disabled={!formState.formIsValid}
              />
            )
          )}
        </View>

        <SubmitButton
          title="Logout"
          onPress={() => dispatch(userLogout())}
          style={{ marginTop: 20 }}
          color={colors.red}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: "center",
  },
});

export default SettingsScreen;
