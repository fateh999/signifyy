export type COLORS = {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  warning: string;
  error: string;
  text: string;
  onSurface: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  notification: string;
  white: string;
  black: string;
  success: string;
  transparent: string;
  adaptivePrimary: string;
  divider: string;
};

export type FONTS = {
  light: {
    fontFamily: 'System';
    fontWeight: '300';
  };
  regular: {
    fontFamily: 'System';
    fontWeight: '400';
  };
  medium: {
    fontFamily: 'System';
    fontWeight: '500';
  };
  bold: {
    fontFamily: 'System';
    fontWeight: '700';
  };
};

export type THEME_TYPE = {
  type: 'light' | 'dark';
  colors: COLORS;
  fonts: FONTS;
};

export type VARIANT = keyof COLORS;

export type FONT_TYPES = keyof FONTS;
