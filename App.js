import "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import AppNavigator from "./navigation/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { MenuProvider } from "react-native-popup-menu";

SplashScreen.preventAutoHideAsync();

const App = () => {
  SplashScreen.preventAutoHideAsync();
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          black: require("./assets/fonts/Roboto_Condensed-Black.ttf"),
          blackItalic: require("./assets/fonts/Roboto_Condensed-BlackItalic.ttf"),
          bold: require("./assets/fonts/Roboto_Condensed-Bold.ttf"),
          boldItalic: require("./assets/fonts/Roboto_Condensed-BoldItalic.ttf"),
          italic: require("./assets/fonts/Roboto_Condensed-Italic.ttf"),
          light: require("./assets/fonts/Roboto_Condensed-Light.ttf"),
          lightItalic: require("./assets/fonts/Roboto_Condensed-LightItalic.ttf"),
          medium: require("./assets/fonts/Roboto_Condensed-Medium.ttf"),
          mediumItalic: require("./assets/fonts/Roboto_Condensed-MediumItalic.ttf"),
          regular: require("./assets/fonts/Roboto_Condensed-Regular.ttf"),
          thin: require("./assets/fonts/Roboto_Condensed-Thin.ttf"),
          thinItalic: require("./assets/fonts/Roboto_Condensed-ThinItalic.ttf"),
        });
      } catch (error) {
        console.log.error();
      } finally {
        setAppIsLoaded(true);
      }
    };

    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded]);

  if (!appIsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider style={styles.container} onLayout={onLayout}>
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  label: {
    color: "black",
    fontStyle: "bold",
    fontFamily: "mediumItalic",
  },
});

export default App;
