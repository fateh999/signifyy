import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Router from './Navigation/Router';

function App() {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <Router />
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  rootView: {flex: 1},
});
