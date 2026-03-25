package com.cardscannerapp

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  companion object {
    var launchArgs: Bundle? = null
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    // Capture all extras, as Detox passes arguments as flattened extras
    launchArgs = intent?.extras
    super.onCreate(savedInstanceState)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    // Update launchArgs with new intent extras
    launchArgs = intent?.extras
    setIntent(intent) // Good practice to update the intent
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "CardScannerApp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
