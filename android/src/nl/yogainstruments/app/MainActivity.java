package nl.yogainstruments.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Het scherm: een WebView met de instrumenten (assets/index.html), schermvullend en zonder dat het scherm uitgaat. */
public final class MainActivity extends Activity {
    private WebView web;

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#102420"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true); // taal, volume, gekozen instrument en liedje onthouden
        s.setMediaPlaybackRequiresUserGesture(false);
        web.setWebViewClient(new WebViewClient() {
            // Links naar buiten (zoals de koffielink) openen in de browser
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                String scheme = u.getScheme();
                if ("file".equals(scheme)) return false;
                if ("http".equals(scheme) || "https".equals(scheme)) startActivity(new Intent(Intent.ACTION_VIEW, u));
                return true;
            }
        });
        web.loadUrl("file:///android_asset/index.html" + songQuery(getIntent()));
        setContentView(web);
    }

    // Song Library opent de kalimba met een liedje: extra's "song" en "mode" (practice of listen)
    private static String songQuery(Intent i) {
        String song = i == null ? null : i.getStringExtra("song");
        if (song == null || !song.matches("[a-z0-9]+")) return "";
        String mode = "listen".equals(i.getStringExtra("mode")) ? "listen" : "practice";
        return "?song=" + song + "&mode=" + mode;
    }

    @Override protected void onNewIntent(Intent i) {
        super.onNewIntent(i);
        setIntent(i);
        String q = songQuery(i);
        if (q.isEmpty()) return;
        String song = i.getStringExtra("song"), mode = q.endsWith("listen") ? "listen" : "practice";
        web.evaluateJavascript("window.openSong && openSong('" + song + "','" + mode + "')", null);
    }

    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // Schermvullend: status- en navigatiebalk verdwijnen, een veeg vanaf de rand haalt ze terug
        if (hasFocus) web.setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }

    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override protected void onPause() { web.onPause(); super.onPause(); }
}
