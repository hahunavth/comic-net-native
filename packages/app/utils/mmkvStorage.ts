/**
 * NOTE: SPECIFIC NATIVE
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";
import { Storage } from "redux-persist";
import { Platform } from "react-native";

export const storage = new MMKV();

/**
 * NOTE: STORAGE WRAPPER
 */

export const mmkvStorage: Storage = {
  setItem: (key, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  }
};

/**
 * NOTE: MIGRATE STORAGE FROM ASYNC STORAGE
 */

// TODO: Remove `hasMigratedFromAsyncStorage` after a while (when everyone has migrated)
export const hasMigratedFromAsyncStorage = storage.getBoolean(
  "hasMigratedFromAsyncStorage"
);

// TODO: Remove `hasMigratedFromAsyncStorage` after a while (when everyone has migrated)
export async function migrateFromAsyncStorage(): Promise<void> {
  console.log("Migrating from AsyncStorage -> MMKV...");
  const start = global.performance.now();

  const keys = await AsyncStorage.getAllKeys();

  for (const key of keys) {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value != null) {
        if (["true", "false"].includes(value)) {
          storage.set(key, value === "true");
        } else {
          storage.set(key, value);
        }

        AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(
        `Failed to migrate key "${key}" from AsyncStorage to MMKV!`,
        error
      );
      throw error;
    }
  }

  storage.set("hasMigratedFromAsyncStorage", true);

  const end = global.performance.now();
  console.log(`Migrated from AsyncStorage -> MMKV in ${end - start}ms!`);
}
