package com.cardscannerapp

import androidx.compose.ui.test.junit4.createAndroidComposeRule
import com.cardscannerapp.MainActivity
import org.junit.Rule

open class ComposeTestRule {
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()
}
