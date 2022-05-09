import {useEffect, useRef} from 'react';
import {DeviceEventEmitter} from 'react-native';

function useEventEmitter(event: string, onEvent: (data: any) => void) {
  const eventRef = useRef(event);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      eventRef.current,
      onEvent,
    );

    return () => {
      subscription.remove();
    };
  }, [onEvent]);
}

export default useEventEmitter;

export const emitEvent = (event: string, data?: any) => {
  DeviceEventEmitter.emit(event, data);
};
