import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Router from "src/Navigation/Router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

MaterialCommunityIcons.loadFont();

function App() {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <SafeAreaProvider>
        <Router />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  rootView: { flex: 1 },
});
