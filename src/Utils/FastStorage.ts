import MMKVStorage from 'react-native-mmkv-storage';

class FastStorage {
  MMKV;

  constructor() {
    this.MMKV = new MMKVStorage.Loader().initialize();
  }

  // MMKV types getItem as Promise<unknown>, but its own callback overload
  // declares the result as `string | null`.
  getItem = (key: string) => this.MMKV.getItem(key) as Promise<string | null>;

  setItem = (key: string, value: string) => this.MMKV.setItem(key, value);

  removeItem = (key: string) => this.MMKV.removeItem(key);

  clear = () => this.MMKV.clearStore();
}

export default new FastStorage();
