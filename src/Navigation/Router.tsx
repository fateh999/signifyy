import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AlertPopup from "src/Components/AlertPopup/AlertPopup";
import RootStackNavigator from "./StackNavigators/RootStackNavigator";

function Router() {
  return (
    <NavigationContainer>
      <RootStackNavigator />
      <AlertPopup />
    </NavigationContainer>
  );
}

export default Router;
