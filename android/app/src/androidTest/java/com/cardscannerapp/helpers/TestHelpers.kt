package com.cardscannerapp.helpers

import android.content.Context
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.espresso.Espresso
import androidx.test.espresso.intent.Intents
import com.cardscannerapp.MainActivity
import java.io.File

object TestHelpers {
    
    fun launchApp(): ActivityScenario<MainActivity> {
        Intents.init()
        return ActivityScenario.launch(MainActivity::class.java)
    }
    
    fun closeApp(scenario: ActivityScenario<MainActivity>) {
        scenario.close()
        Intents.release()
    }
    
    fun resetAppData() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        context.getSharedPreferences("settings", Context.MODE_PRIVATE).edit().clear().apply()
        context.deleteDatabase("card_scanner_database")
    }
    
    fun copyTestAssetToCache(assetName: String): String {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val inputStream = context.assets.open("business_cards/$assetName")
        val outputFile = File(context.cacheDir, "test_card.jpg")
        inputStream.use { input ->
            outputFile.outputStream().use { output ->
                input.copyTo(output)
            }
        }
        return outputFile.absolutePath
    }
}
