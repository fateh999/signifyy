import {useEffect, useRef, useState} from 'react';
import {BehaviorSubject} from 'rxjs';

function useObservableValue<T>(observer$: Readonly<BehaviorSubject<T>>) {
  const [value, setValue] = useState(observer$.getValue());
  const observerRef = useRef(observer$);

  useEffect(() => {
    const subscription = observerRef.current.subscribe(setValue);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return value;
}

export default useObservableValue;
