package com.cardscannerapp.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.cardscannerapp.domain.model.AppSettings
import com.cardscannerapp.domain.model.DataUsagePreference
import com.cardscannerapp.domain.model.DEFAULT_APP_SETTINGS
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class SettingsRepository(private val context: Context) {

    companion object {
        val OCR_LANGUAGES = stringPreferencesKey("ocr_languages")
        val AUTO_SAVE = booleanPreferencesKey("auto_save")
        val NOTIFICATIONS = booleanPreferencesKey("notifications")
        val DATA_USAGE = stringPreferencesKey("data_usage")
        val HAPTIC_ENABLED = booleanPreferencesKey("haptic_enabled")
    }

    val appSettings: Flow<AppSettings> = context.dataStore.data
        .catch { exception ->
            if (exception is IOException) emit(emptyPreferences())
            else throw exception
        }
        .map { preferences ->
            AppSettings(
                ocrLanguages = (preferences[OCR_LANGUAGES] ?: "eng").split(","),
                autoSave = preferences[AUTO_SAVE] ?: DEFAULT_APP_SETTINGS.autoSave,
                notifications = preferences[NOTIFICATIONS] ?: DEFAULT_APP_SETTINGS.notifications,
                dataUsage = DataUsagePreference.valueOf(
                    preferences[DATA_USAGE] ?: DEFAULT_APP_SETTINGS.dataUsage.name
                ),
                hapticEnabled = preferences[HAPTIC_ENABLED] ?: DEFAULT_APP_SETTINGS.hapticEnabled
            )
        }

    suspend fun updateSettings(settings: AppSettings) {
        context.dataStore.edit { preferences ->
            preferences[OCR_LANGUAGES] = settings.ocrLanguages.joinToString(",")
            preferences[AUTO_SAVE] = settings.autoSave
            preferences[NOTIFICATIONS] = settings.notifications
            preferences[DATA_USAGE] = settings.dataUsage.name
            preferences[HAPTIC_ENABLED] = settings.hapticEnabled
        }
    }

    suspend fun resetSettings() {
        context.dataStore.edit { it.clear() }
    }
}
