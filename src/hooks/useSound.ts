import { useCallback, useState } from 'react';

export const useSound = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  const playSound = useCallback((type: string) => {
    if (!isEnabled) return null;
    return null;
  }, [isEnabled]);

  const stopSound = useCallback((audio: HTMLAudioElement | null) => {
    // No-op for now
  }, []);

  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return { playSound, stopSound, toggleSound, isEnabled };
};
