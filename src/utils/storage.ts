import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Contact,
  createContact,
  generateContactId,
  normalizeContactDraft,
} from "../types/contact";
import {
  AppSettings,
  DataUsagePreference,
  DEFAULT_APP_SETTINGS,
} from "../types/settings";

const STORAGE_KEYS = {
  contacts: "contacts",
  autoSave: "autoSave",
  notificationEnabled: "notificationEnabled",
  dataUsage: "dataUsage",
  ocrLanguages: "ocrLanguages",
} as const;

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const hasNormalizedContactShape = (value: unknown): value is Contact => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const contact = value as Partial<Contact>;

  return (
    isNonEmptyString(contact.id) &&
    isNonEmptyString(contact.scannedAt) &&
    typeof contact.name === "string" &&
    typeof contact.email === "string" &&
    typeof contact.phone === "string" &&
    typeof contact.company === "string" &&
    typeof contact.address === "string" &&
    typeof contact.website === "string" &&
    (contact.updatedAt === undefined || isNonEmptyString(contact.updatedAt))
  );
};

const normalizeStoredContact = (value: unknown): Contact => {
  const contact =
    value && typeof value === "object" ? (value as Partial<Contact>) : {};
  const normalizedDraft = normalizeContactDraft(contact);

  return createContact(normalizedDraft, {
    id: isNonEmptyString(contact.id) ? contact.id.trim() : generateContactId(),
    scannedAt: isNonEmptyString(contact.scannedAt)
      ? contact.scannedAt.trim()
      : new Date().toISOString(),
    updatedAt: isNonEmptyString(contact.updatedAt)
      ? contact.updatedAt.trim()
      : undefined,
  });
};

export const storageUtils = {
  // Contacts
  getContacts: async (): Promise<Contact[]> => {
    try {
      const contactsJson = await AsyncStorage.getItem(STORAGE_KEYS.contacts);
      if (!contactsJson) {
        return [];
      }

      const parsed = JSON.parse(contactsJson) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }

      const normalizedContacts = parsed.map(normalizeStoredContact);
      const requiresMigration = parsed.some(
        (contact) => !hasNormalizedContactShape(contact)
      );

      if (requiresMigration) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.contacts,
          JSON.stringify(normalizedContacts)
        );
      }

      return normalizedContacts;
    } catch (error) {
      console.error("Failed to get contacts:", error);
      return [];
    }
  },

  saveContacts: async (contacts: Contact[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.contacts,
        JSON.stringify(contacts.map(normalizeStoredContact))
      );
    } catch (error) {
      console.error("Failed to save contacts:", error);
      throw error;
    }
  },

  addContact: async (contact: Contact): Promise<Contact> => {
    const normalizedContact = normalizeStoredContact(contact);

    try {
      const contacts = await storageUtils.getContacts();
      contacts.push(normalizedContact);
      await storageUtils.saveContacts(contacts);
      return normalizedContact;
    } catch (error) {
      console.error("Failed to add contact:", error);
      throw error;
    }
  },

  updateContact: async (
    id: string,
    updatedContact: Contact
  ): Promise<Contact | null> => {
    try {
      const contacts = await storageUtils.getContacts();
      const index = contacts.findIndex((contact) => contact.id === id);
      if (index !== -1) {
        contacts[index] = normalizeStoredContact({
          ...contacts[index],
          ...updatedContact,
          id,
        });
        await storageUtils.saveContacts(contacts);
        return contacts[index];
      }

      return null;
    } catch (error) {
      console.error("Failed to update contact:", error);
      throw error;
    }
  },

  deleteContact: async (id: string): Promise<void> => {
    try {
      const contacts = await storageUtils.getContacts();
      const filteredContacts = contacts.filter((contact) => contact.id !== id);
      await storageUtils.saveContacts(filteredContacts);
    } catch (error) {
      console.error("Failed to delete contact:", error);
      throw error;
    }
  },

  // Settings
  getSetting: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? (JSON.parse(value) as T) : defaultValue;
    } catch (error) {
      console.error("Failed to get setting:", error);
      return defaultValue;
    }
  },

  saveSetting: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save setting:", error);
      throw error;
    }
  },

  // OCR Languages
  getOcrLanguages: async (): Promise<string[]> => {
    try {
      const languages = await AsyncStorage.getItem(STORAGE_KEYS.ocrLanguages);
      return languages
        ? (JSON.parse(languages) as string[])
        : DEFAULT_APP_SETTINGS.ocrLanguages;
    } catch (error) {
      console.error("Failed to get OCR languages:", error);
      return DEFAULT_APP_SETTINGS.ocrLanguages;
    }
  },

  saveOcrLanguages: async (languages: string[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ocrLanguages,
        JSON.stringify(languages)
      );
    } catch (error) {
      console.error("Failed to save OCR languages:", error);
      throw error;
    }
  },

  getAutoSaveEnabled: async (): Promise<boolean> => {
    return storageUtils.getSetting<boolean>(
      STORAGE_KEYS.autoSave,
      DEFAULT_APP_SETTINGS.autoSave
    );
  },

  saveAutoSaveEnabled: async (value: boolean): Promise<void> => {
    await storageUtils.saveSetting(STORAGE_KEYS.autoSave, value);
  },

  getNotificationEnabled: async (): Promise<boolean> => {
    return storageUtils.getSetting<boolean>(
      STORAGE_KEYS.notificationEnabled,
      DEFAULT_APP_SETTINGS.notificationEnabled
    );
  },

  saveNotificationEnabled: async (value: boolean): Promise<void> => {
    await storageUtils.saveSetting(STORAGE_KEYS.notificationEnabled, value);
  },

  getDataUsagePreference: async (): Promise<DataUsagePreference> => {
    return storageUtils.getSetting<DataUsagePreference>(
      STORAGE_KEYS.dataUsage,
      DEFAULT_APP_SETTINGS.dataUsage
    );
  },

  saveDataUsagePreference: async (
    value: DataUsagePreference
  ): Promise<void> => {
    await storageUtils.saveSetting(STORAGE_KEYS.dataUsage, value);
  },

  getAppSettings: async (): Promise<AppSettings> => {
    const [ocrLanguages, autoSave, notificationEnabled, dataUsage] =
      await Promise.all([
        storageUtils.getOcrLanguages(),
        storageUtils.getAutoSaveEnabled(),
        storageUtils.getNotificationEnabled(),
        storageUtils.getDataUsagePreference(),
      ]);

    return {
      ocrLanguages,
      autoSave,
      notificationEnabled,
      dataUsage,
    };
  },

  resetAppData: async (): Promise<void> => {
    try {
      // AsyncStorage.multiRemove is available but types may be incomplete
      await (AsyncStorage as unknown as { multiRemove: (keys: string[]) => Promise<void> }).multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error("Failed to reset app data:", error);
      throw error;
    }
  },
};

export default storageUtils;
