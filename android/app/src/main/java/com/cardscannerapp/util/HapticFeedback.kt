package com.cardscannerapp.util

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.Build

object HapticFeedback {

    fun light(context: Context) {
        if (!isHapticEnabled(context)) return
        vibrate(context, VibrationEffect.EFFECT_TICK)
    }

    fun medium(context: Context) {
        if (!isHapticEnabled(context)) return
        vibrate(context, VibrationEffect.EFFECT_CLICK)
    }

    fun heavy(context: Context) {
        if (!isHapticEnabled(context)) return
        vibrate(context, VibrationEffect.EFFECT_HEAVY_CLICK)
    }

    fun success(context: Context) {
        if (!isHapticEnabled(context)) return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            vibrate(context, VibrationEffect.EFFECT_DOUBLE_CLICK)
        } else {
            vibrate(context, 100)
        }
    }

    fun error(context: Context) {
        if (!isHapticEnabled(context)) return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            vibrator.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 100, 50, 100), -1))
        } else {
            vibrate(context, 200)
        }
    }

    private fun vibrate(context: Context, effectId: Int) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            if (vibrator.hasVibrator()) {
                vibrator.vibrate(VibrationEffect.createPredefined(effectId))
            }
        }
    }

    private fun vibrate(context: Context, duration: Long) {
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(duration)
        }
    }

    private fun isHapticEnabled(context: Context): Boolean {
        val prefs = context.getSharedPreferences("settings", Context.MODE_PRIVATE)
        return prefs.getBoolean("haptic_enabled", true)
    }
}
