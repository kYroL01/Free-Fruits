import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

/** Real reconnect detection (not simulated) — drives the offline banner and queue drain. */
export function useNetworkStatus(): { isConnected: boolean } {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected && state.isInternetReachable !== false);
    });
    return unsubscribe;
  }, []);

  return { isConnected };
}
