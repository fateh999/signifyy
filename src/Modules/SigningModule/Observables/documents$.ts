import {BehaviorSubject} from 'rxjs';
import PersistStorage from 'src/Utils/PersistStorage';
import {DOCUMENT_DATA} from '../Types/CommonTypes';

const documents$ = new BehaviorSubject<Array<DOCUMENT_DATA>>([]);

const persistStorage = new PersistStorage('documents', documents$);
persistStorage.init();

export default documents$;
