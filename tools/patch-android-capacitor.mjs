import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ANDROID_DIR = path.join(ROOT_DIR, 'android');

async function patchAndroidManifest() {
  const manifestPath = path.join(ANDROID_DIR, 'app', 'src', 'main', 'AndroidManifest.xml');
  let xml = await fs.readFile(manifestPath, 'utf-8');

  // Enable hardware acceleration and largeHeap for heavy 3D .glb car & campus models
  if (!xml.includes('android:hardwareAccelerated')) {
    xml = xml.replace('<application', '<application\n        android:hardwareAccelerated="true"');
  }
  if (!xml.includes('android:largeHeap')) {
    xml = xml.replace('<application', '<application\n        android:largeHeap="true"');
  }

  // Lock gameplay to ergonomic landscape orientation
  if (!xml.includes('android:screenOrientation')) {
    xml = xml.replace(
      'android:name=".MainActivity"',
      'android:name=".MainActivity"\n            android:screenOrientation="sensorLandscape"'
    );
  }

  await fs.writeFile(manifestPath, xml, 'utf-8');
  console.log('[patch-android] Patched AndroidManifest.xml (landscape + hardwareAccelerated + largeHeap)');
}

async function patchMainActivity() {
  const javaDir = path.join(
    ANDROID_DIR,
    'app',
    'src',
    'main',
    'java',
    'com',
    'pelicancampus',
    'cars'
  );
  const activityPath = path.join(javaDir, 'MainActivity.java');
  try {
    await fs.access(activityPath);
  } catch {
    console.warn('[patch-android] MainActivity.java not found at expected path, skipping fullscreen patch.');
    return;
  }

  const code = `package com.pelicancampus.cars;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        enableImmersiveFullscreen();
    }

    @Override
    public void onStart() {
        super.onStart();
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebSettings settings = this.bridge.getWebView().getSettings();
            settings.setDomStorageEnabled(true);
            settings.setJavaScriptEnabled(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setAllowFileAccess(true);
            this.bridge.getWebView().setLayerType(View.LAYER_TYPE_HARDWARE, null);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            enableImmersiveFullscreen();
        }
    }

    private void enableImmersiveFullscreen() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        if (controller != null) {
            controller.hide(WindowInsetsCompat.Type.systemBars());
            controller.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            );
        }
    }
}
`;
  await fs.writeFile(activityPath, code, 'utf-8');
  console.log('[patch-android] Patched MainActivity.java (immersive fullscreen + WebGL hardware layer)');
}

async function main() {
  await patchAndroidManifest();
  await patchMainActivity();
}

main().catch((err) => {
  console.error('[patch-android] Failed:', err);
  process.exit(1);
});
