import useObservableValue from 'src/Hooks/useObservableValue';
import {DayTheme, NightTheme} from '../Config/Theme';
import theme$ from '../Observables/theme$';
import {THEME_TYPE} from '../Types/CommonTypes';

function useThemeValue() {
  return useObservableValue(theme$);
}

export default useThemeValue;

export const getThemeValue = () => theme$.getValue();

export const setThemeValue = (theme: THEME_TYPE) => theme$.next(theme);

export const toggleTheme = () => {
  const {type} = getThemeValue();
  theme$.next(type === 'dark' ? DayTheme : NightTheme);
};
