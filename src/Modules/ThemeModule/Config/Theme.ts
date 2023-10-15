import {THEME_TYPE} from '../Types/CommonTypes';

export const DayTheme: THEME_TYPE = {
  type: 'light',
  colors: {
    primary: '#00A1E4',
    accent: '#623CEA',
    background: '#f8f9fa',
    surface: '#ffffff',
    warning: '#F5B700',
    error: '#FF3C38',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#adb5bd',
    placeholder: '#6c757d',
    backdrop: 'rgba(0,0,0,0.5)',
    notification: '#DC0073',
    white: '#ffffff',
    black: '#000000',
    success: '#04E762',
    transparent: 'transparent',
    adaptivePrimary: '#00A1E4',
    divider: 'rgba(0,0,0,0.26)',
  },
  fonts: {
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
};

export const NightTheme: THEME_TYPE = {
  type: 'dark',
  colors: {
    primary: '#00A1E4',
    accent: '#623CEA',
    background: '#121212',
    surface: '#121212',
    warning: '#F5B700',
    error: '#FF3C38',
    onSurface: '#FFFFFF',
    text: '#FFFFFF',
    disabled: 'rgba(255,255,255,0.38)',
    placeholder: 'rgba(255,255,255,0.54)',
    backdrop: 'rgba(255,255,255,0.5)',
    notification: '#DC0073',
    white: '#ffffff',
    black: '#000000',
    success: '#04E762',
    transparent: 'transparent',
    adaptivePrimary: '#121212',
    divider: 'rgba(255,255,255,0.38)',
  },
  fonts: {
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
};
