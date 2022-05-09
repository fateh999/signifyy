import {ColorValue} from 'react-native';

export type FILE = {
  uri: string;
  type: any;
  name: string;
};

export type ALERT_OPTIONS = {
  title: string;
  description?: string;
  buttonList: Array<ALERT_BUTTON>;
};

export type ALERT_BUTTON = {
  text: string;
  onPress: () => void;
  backgroundColor?: ColorValue;
  color?: ColorValue;
};
