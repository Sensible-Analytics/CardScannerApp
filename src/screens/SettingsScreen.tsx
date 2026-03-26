import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  AppSettings,
  DataUsagePreference,
  DEFAULT_APP_SETTINGS,
} from "../types/settings";
import { createContact } from "../types/contact";
import { showErrorAlert } from "../utils/errorHandler";
import storageUtils from "../utils/storage";
import { shouldDisableCameraForE2ESync } from "../utils/launchArgs";

const AVAILABLE_LANGUAGES = [
  "eng",
  "spa",
  "fra",
  "deu",
  "ita",
  "por",
  "rus",
  "jap",
  "kor",
  "chi_sim",
];

const LANGUAGE_NAMES: Record<string, string> = {
  eng: "English",
  spa: "Spanish",
  fra: "French",
  deu: "German",
  ita: "Italian",
  por: "Portuguese",
  rus: "Russian",
  jap: "Japanese",
  kor: "Korean",
  chi_sim: "Chinese (Simplified)",
};

const QA_SAMPLE_CONTACTS = [
  createContact(
    {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 415 555 0101",
      company: "Acme Labs",
      address: "100 Market Street, San Francisco, CA",
      website: "https://acme.example.com",
    },
    {
      id: "qa-contact-jane-doe",
      scannedAt: "2026-03-24T10:00:00.000Z",
    }
  ),
  createContact(
    {
      name: "Carlos Ruiz",
      email: "carlos.ruiz@example.com",
      phone: "+34 91 555 0202",
      company: "Northwind Iberia",
      address: "Gran Via 1, Madrid, Spain",
      website: "https://northwind.example.com",
    },
    {
      id: "qa-contact-carlos-ruiz",
      scannedAt: "2026-03-24T11:00:00.000Z",
    }
  ),
];

const SettingsScreen = () => {
  const [ocrLanguages, setOcrLanguages] = useState<string[]>(
    DEFAULT_APP_SETTINGS.ocrLanguages
  );
  const [autoSave, setAutoSave] = useState(DEFAULT_APP_SETTINGS.autoSave);
  const [notificationEnabled, setNotificationEnabled] = useState(
    DEFAULT_APP_SETTINGS.notificationEnabled
  );
  const [dataUsage, setDataUsage] = useState<DataUsagePreference>(
    DEFAULT_APP_SETTINGS.dataUsage
  );
  const [isLoading, setIsLoading] = useState(true);
  const isE2E = shouldDisableCameraForE2ESync();

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings = await storageUtils.getAppSettings();

      setOcrLanguages(settings.ocrLanguages);
      setAutoSave(settings.autoSave);
      setNotificationEnabled(settings.notificationEnabled);
      setDataUsage(settings.dataUsage);
    } catch (error) {
      console.warn("Failed to load settings:", error);
      showErrorAlert(error, "Load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const persistSettings = useCallback(
    async (nextSettings: Partial<AppSettings>) => {
      try {
        const updates: Promise<void>[] = [];

        if (nextSettings.ocrLanguages) {
          updates.push(
            storageUtils.saveOcrLanguages(nextSettings.ocrLanguages)
          );
        }

        if (typeof nextSettings.autoSave === "boolean") {
          updates.push(storageUtils.saveAutoSaveEnabled(nextSettings.autoSave));
        }

        if (typeof nextSettings.notificationEnabled === "boolean") {
          updates.push(
            storageUtils.saveNotificationEnabled(
              nextSettings.notificationEnabled
            )
          );
        }

        if (nextSettings.dataUsage) {
          updates.push(
            storageUtils.saveDataUsagePreference(nextSettings.dataUsage)
          );
        }

        await Promise.all(updates);
      } catch (error) {
        console.warn("Failed to persist settings:", error);
        showErrorAlert(error, "Save settings");
        throw error;
      }
    },
    []
  );

  const toggleLanguage = useCallback(
    async (language: string) => {
      const nextLanguages = ocrLanguages.includes(language)
        ? ocrLanguages.filter((currentLanguage) => currentLanguage !== language)
        : [...ocrLanguages, language];

      setOcrLanguages(nextLanguages);

      try {
        await persistSettings({ ocrLanguages: nextLanguages });
      } catch {
        setOcrLanguages(ocrLanguages);
      }
    },
    [ocrLanguages, persistSettings]
  );

  const handleAutoSaveChange = useCallback(
    async (value: boolean) => {
      setAutoSave(value);

      try {
        await persistSettings({ autoSave: value });
      } catch {
        setAutoSave(!value);
      }
    },
    [persistSettings]
  );

  const handleNotificationChange = useCallback(
    async (value: boolean) => {
      setNotificationEnabled(value);

      try {
        await persistSettings({ notificationEnabled: value });
      } catch {
        setNotificationEnabled(!value);
      }
    },
    [persistSettings]
  );

  const handleDataUsageChange = useCallback(
    async (value: DataUsagePreference) => {
      const previousValue = dataUsage;
      setDataUsage(value);

      try {
        await persistSettings({ dataUsage: value });
      } catch {
        setDataUsage(previousValue);
      }
    },
    [dataUsage, persistSettings]
  );

  const handleExportData = useCallback(async () => {
    try {
      const contacts = await storageUtils.getContacts();
      Alert.alert(
        "Export Data",
        `Export currently supports contacts CSV/VCard sharing from the Contacts screen. ${contacts.length} contact(s) available.`
      );
    } catch (error) {
      showErrorAlert(error, "Export data");
    }
  }, []);

  const handleImportData = useCallback(() => {
    Alert.alert(
      "Import Data",
      "Import is not implemented yet. Export support is available from the Contacts screen."
    );
  }, []);

  const handleSeedSampleContacts = useCallback(async () => {
    try {
      await storageUtils.saveContacts(QA_SAMPLE_CONTACTS);
      Alert.alert("Success", "Loaded sample contacts for QA.");
    } catch (error) {
      showErrorAlert(error, "Load QA contacts");
    }
  }, []);

  const handleResetApp = useCallback(() => {
    Alert.alert(
      "Reset App",
      "Are you sure you want to reset all data and settings? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await storageUtils.resetAppData();
              setOcrLanguages(DEFAULT_APP_SETTINGS.ocrLanguages);
              setAutoSave(DEFAULT_APP_SETTINGS.autoSave);
              setNotificationEnabled(DEFAULT_APP_SETTINGS.notificationEnabled);
              setDataUsage(DEFAULT_APP_SETTINGS.dataUsage);
              Alert.alert("Success", "App has been reset to default settings.");
            } catch (error) {
              showErrorAlert(error, "Reset app");
            }
          },
        },
      ]
    );
  }, []);

  if (isLoading) {
    return (
      <View style={Styles.container}>
        <View style={Styles.header} testID="header">
          <Text style={Styles.headerTitle} testID="header-title">
            Settings
          </Text>
        </View>
        <View style={Styles.loadingContainer}>
          <Text style={Styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={Styles.container} testID="settings-screen">
      <View style={Styles.header} testID="header">
        <Text style={Styles.headerTitle} testID="header-title">
          Settings
        </Text>
      </View>

      <View style={Styles.section} testID="ocr-settings-section">
        <Text style={Styles.sectionTitle} testID="section-title">
          OCR Settings
        </Text>
        {AVAILABLE_LANGUAGES.map((language) => (
          <View
            key={language}
            style={Styles.languageRow}
            testID={`language-row-${language}`}
          >
            <TouchableOpacity
              style={[
                Styles.languageButton,
                ocrLanguages.includes(language)
                  ? Styles.selectedLanguage
                  : null,
              ]}
              onPress={() => toggleLanguage(language)}
              testID={`language-toggle-${language}`}
            >
              <Text
                style={Styles.languageText}
                testID={`language-text-${language}`}
              >
                {LANGUAGE_NAMES[language] ?? language}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={Styles.section} testID="general-settings-section">
        <Text style={Styles.sectionTitle} testID="section-title">
          General Settings
        </Text>
        <View style={Styles.settingRow} testID="auto-save-row">
          <Text style={Styles.settingLabel} testID="setting-label">
            Auto-save Contacts
          </Text>
          <Switch
            value={autoSave}
            onValueChange={handleAutoSaveChange}
            thumbColor={autoSave ? "#f5dd4b" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            testID="auto-save-switch"
          />
        </View>
        <View style={Styles.settingRow} testID="notifications-row">
          <Text style={Styles.settingLabel} testID="setting-label">
            Notifications
          </Text>
          <Switch
            value={notificationEnabled}
            onValueChange={handleNotificationChange}
            thumbColor={notificationEnabled ? "#f5dd4b" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            testID="notifications-switch"
          />
        </View>
        <View style={Styles.settingRow} testID="data-usage-row">
          <Text style={Styles.settingLabel} testID="setting-label">
            Data Usage
          </Text>
          <View style={Styles.dataUsageOptions} testID="data-usage-options">
            <TouchableOpacity
              style={[
                Styles.dataUsageOption,
                dataUsage === "wifi-only" ? Styles.selectedDataUsage : null,
              ]}
              onPress={() => handleDataUsageChange("wifi-only")}
              testID="wifi-only-option"
            >
              <Text style={Styles.dataUsageText} testID="data-usage-text">
                Wi-Fi Only
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                Styles.dataUsageOption,
                dataUsage === "cellular" ? Styles.selectedDataUsage : null,
              ]}
              onPress={() => handleDataUsageChange("cellular")}
              testID="cellular-option"
            >
              <Text style={Styles.dataUsageText} testID="data-usage-text">
                Cellular
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={Styles.section} testID="data-management-section">
        <Text style={Styles.sectionTitle} testID="section-title">
          Data Management
        </Text>
        <TouchableOpacity
          style={Styles.button}
          onPress={handleExportData}
          testID="export-data-button"
        >
          <MaterialCommunityIcons
            name="content-save-all"
            size={20}
            color="#fff"
          />
          <Text style={Styles.buttonText} testID="button-text">
            Export Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.button}
          onPress={handleImportData}
          testID="import-data-button"
        >
          <MaterialCommunityIcons
            name="content-duplicate"
            size={20}
            color="#fff"
          />
          <Text style={Styles.buttonText} testID="button-text">
            Import Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.button}
          onPress={handleResetApp}
          testID="reset-app-button"
        >
          <MaterialCommunityIcons name="restart" size={20} color="#fff" />
          <Text style={Styles.buttonText} testID="button-text">
            Reset App
          </Text>
        </TouchableOpacity>
      </View>

      {__DEV__ || isE2E ? (
        <View style={Styles.section} testID="qa-tools-section">
          <Text style={Styles.sectionTitle}>QA Tools</Text>
          <TouchableOpacity
            style={Styles.button}
            onPress={handleSeedSampleContacts}
            testID="qa-seed-sample-contacts-button"
          >
            <MaterialCommunityIcons
              name="flask-outline"
              size={20}
              color="#fff"
            />
            <Text style={Styles.buttonText}>Load Sample Contacts</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default SettingsScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#0066cc",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  languageRow: {
    marginBottom: 10,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d0d7e2",
    borderRadius: 8,
  },
  selectedLanguage: {
    backgroundColor: "#e6f0ff",
    borderColor: "#0066cc",
  },
  languageText: {
    fontSize: 15,
    color: "#333",
  },
  settingRow: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  dataUsageOptions: {
    flexDirection: "row",
    gap: 12,
  },
  dataUsageOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d0d7e2",
    borderRadius: 8,
  },
  selectedDataUsage: {
    backgroundColor: "#e6f0ff",
    borderColor: "#0066cc",
  },
  dataUsageText: {
    fontSize: 15,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "#0066cc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
