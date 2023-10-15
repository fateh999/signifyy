import {Appearance} from 'react-native';
import {BehaviorSubject} from 'rxjs';
import PersistStorage from 'src/Utils/PersistStorage';
import {NightTheme, DayTheme} from '../Config/Theme';
import {THEME_TYPE} from '../Types/CommonTypes';

const initialColorScheme = Appearance.getColorScheme();
const theme$ = new BehaviorSubject<THEME_TYPE>(
  initialColorScheme === 'dark' ? NightTheme : DayTheme,
);
const persistStorage = new PersistStorage('theme', theme$);
persistStorage.init();

export default theme$;

Appearance.addChangeListener(({colorScheme}) => {
  if (colorScheme === 'dark') {
    theme$.next(NightTheme);
  } else {
    theme$.next(DayTheme);
  }
});
