import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from 'src/Screens/Home/HomeScreen';
import DocumentScreen from 'src/Screens/Document/DocumentScreen';
import {DOCUMENT_DATA} from 'src/Modules/SigningModule/Types/CommonTypes';
import SignatureScreen from 'src/Screens/Signature/SignatureScreen';

export type RootStackParamList = {
  Home: undefined;
  Document: DOCUMENT_DATA;
  Signature: DOCUMENT_DATA;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name={'Home'} component={HomeScreen} />
      <RootStack.Screen name={'Document'} component={DocumentScreen} />
      <RootStack.Screen name={'Signature'} component={SignatureScreen} />
    </RootStack.Navigator>
  );
}

export default RootStackNavigator;
