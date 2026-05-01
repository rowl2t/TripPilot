import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'offline-pack:';
const mem = new Map<string, string>();

const canUseAsync = typeof AsyncStorage?.setItem === 'function';

export const savePack = async (tripId: string, packJson: string): Promise<void> => {
  if (canUseAsync) return AsyncStorage.setItem(`${KEY_PREFIX}${tripId}`, packJson);
  mem.set(`${KEY_PREFIX}${tripId}`, packJson);
};

export const loadPack = async (tripId: string): Promise<string | null> => {
  if (canUseAsync) return AsyncStorage.getItem(`${KEY_PREFIX}${tripId}`);
  return mem.get(`${KEY_PREFIX}${tripId}`) ?? null;
};
