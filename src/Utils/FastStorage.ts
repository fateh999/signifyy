import MMKVStorage from 'react-native-mmkv-storage';

class FastStorage {
  MMKV;

  constructor() {
    this.MMKV = new MMKVStorage.Loader().initialize();
  }

  getItem = (key: string) => this.MMKV.getItem(key);

  setItem = (key: string, value: string) => this.MMKV.setItem(key, value);

  removeItem = (key: string) => this.MMKV.removeItem(key);

  clear = () => this.MMKV.clearStore();
}

export default new FastStorage();
