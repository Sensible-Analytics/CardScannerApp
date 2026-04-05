package com.cardscannerapp.domain.ocr

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.ExifInterface
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlinx.coroutines.tasks.await
import java.io.File

class OcrEngine {

    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    suspend fun recognizeText(bitmap: Bitmap): String {
        val inputImage = InputImage.fromBitmap(bitmap, 0)
        val visionText = recognizer.process(inputImage).await()
        return visionText.text
    }

    fun cleanup() {
        recognizer.close()
    }
}

object ImageCropper {

    fun cropToCardGuide(bitmap: Bitmap): Bitmap {
        // Crop center region with business card aspect ratio (1.75:1)
        val width = bitmap.width
        val height = bitmap.height
        val cardAspectRatio = 1.75f

        val cropHeight = (Math.min(width, height) * 0.85f).toInt()
        val cropWidth = (cropHeight * cardAspectRatio).toInt()

        val cropX = ((width - cropWidth) / 2).coerceAtLeast(0)
        val cropY = ((height - cropHeight) / 2).coerceAtLeast(0)

        val actualCropWidth = cropWidth.coerceAtMost(width - cropX)
        val actualCropHeight = cropHeight.coerceAtMost(height - cropY)

        return Bitmap.createBitmap(bitmap, cropX, cropY, actualCropWidth, actualCropHeight)
    }

    fun decodeBitmapWithRotation(uri: String): Bitmap? {
        val path = uri.removePrefix("file://")
        val file = File(path)
        if (!file.exists()) return null

        // Get rotation
        val exif = ExifInterface(path)
        val orientation = exif.getAttributeInt(
            ExifInterface.TAG_ORIENTATION,
            ExifInterface.ORIENTATION_NORMAL
        )

        val options = BitmapFactory.Options().apply {
            inSampleSize = calculateInSampleSize(this, path, 1200)
        }

        val bitmap = BitmapFactory.decodeFile(path, options) ?: return null

        val rotation = when (orientation) {
            ExifInterface.ORIENTATION_ROTATE_90 -> 90f
            ExifInterface.ORIENTATION_ROTATE_180 -> 180f
            ExifInterface.ORIENTATION_ROTATE_270 -> 270f
            else -> 0f
        }

        return if (rotation != 0f) {
            val matrix = android.graphics.Matrix()
            matrix.postRotate(rotation)
            Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        } else {
            bitmap
        }
    }

    private fun calculateInSampleSize(options: BitmapFactory.Options, path: String, targetSize: Int): Int {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeFile(path, bounds)
        val (outWidth, outHeight) = bounds.outWidth to bounds.outHeight
        var inSampleSize = 1
        if (outHeight > targetSize || outWidth > targetSize) {
            val halfHeight = outHeight / 2
            val halfWidth = outWidth / 2
            while ((halfHeight / inSampleSize) >= targetSize && (halfWidth / inSampleSize) >= targetSize) {
                inSampleSize *= 2
            }
        }
        return inSampleSize
    }
}
