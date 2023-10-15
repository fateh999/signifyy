import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AlertPopup from 'src/Components/AlertPopup/AlertPopup';
import RootStackNavigator from './StackNavigators/RootStackNavigator';
import RNBootSplash from 'react-native-bootsplash';

function Router() {
  return (
    <NavigationContainer onReady={RNBootSplash.hide}>
      <RootStackNavigator />
      <AlertPopup />
    </NavigationContainer>
  );
}

export default Router;
