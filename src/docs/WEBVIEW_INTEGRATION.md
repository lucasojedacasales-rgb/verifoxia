# Guía de Integración WebView - Trustify

## Pull-to-Refresh Nativo de Android

La app ahora soporta integración con el componente nativo de pull-to-refresh de Android cuando se ejecuta en un WebView personalizado.

### Cómo Funciona

1. **JavaScript Bridge**: La app busca un objeto global `window.__TRUSTIFY_NATIVE__`
2. **Método Disponible**: `window.__TRUSTIFY_NATIVE__.endRefresh()`
3. **Cuándo se Llama**: Al finalizar el refresco de datos en Home.jsx y SearchResults.jsx

### Implementación en WebView (Android)

```java
// En tu Activity/Fragment que contiene el WebView
WebView webView = findViewById(R.id.webview);

// Habilitar el pull-to-refresh del WebView
webView.setOnScrollChangeListener((v, scrollX, scrollY, oldScrollX, oldScrollY) -> {
  boolean isAtTop = scrollY == 0;
  if (isAtTop && mPullRefreshView != null) {
    mPullRefreshView.setEnabled(true);
  }
});

// Inyectar el objeto nativo
webView.addJavascriptInterface(new Object() {
  @JavascriptInterface
  public void endRefresh() {
    // Detener el indicador de refresco nativo
    if (mSwipeRefreshLayout != null) {
      mSwipeRefreshLayout.setRefreshing(false);
    }
  }
}, "__TRUSTIFY_NATIVE__");

// Configurar el refresco
mSwipeRefreshLayout.setOnRefreshListener(() -> {
  // Inyectar evento de refresco en JavaScript
  String js = "if (window.__onNativeRefresh) window.__onNativeRefresh();";
  webView.evaluateJavascript(js, null);
});
```

### Alternativa con Kotlin

```kotlin
// En tu Activity que contiene el WebView
val webView: WebView = findViewById(R.id.webview)

// Crear interfaz nativa
class TrustifyNativeInterface {
    @JavascriptInterface
    fun endRefresh() {
        swipeRefreshLayout.isRefreshing = false
    }
}

// Agregar la interfaz al WebView
webView.addJavascriptInterface(TrustifyNativeInterface(), "__TRUSTIFY_NATIVE__")

// Configurar SwipeRefreshLayout
swipeRefreshLayout.setOnRefreshListener {
    webView.evaluateJavascript("if (window.__onNativeRefresh) window.__onNativeRefresh();", null)
}
```

### Flujo de Refresco

```
[Usuario tira hacia abajo]
         ↓
[Android WebView muestra indicador nativo]
         ↓
[JavaScript llama window.__onNativeRefresh()]
         ↓
[Home.jsx/SearchResults.jsx analiza datos]
         ↓
[JavaScript llama window.__TRUSTIFY_NATIVE__.endRefresh()]
         ↓
[Android WebView oculta indicador nativo]
```

## Safe Area Insets

La app respeta los `env(safe-area-inset-*)` de CSS para:
- Top: Notch/status bar
- Bottom: Navigation bar
- Left/Right: Pantallas con bordes curvos

Estos se aplican automáticamente en:
- AppHeader: `padding-top: calc(env(safe-area-inset-top) + 0.75rem)`
- BottomTabBar: `padding-bottom: env(safe-area-inset-bottom)`
- BottomSheet: `padding-bottom: env(safe-area-inset-bottom)`

## Requisitos Mínimos

- API Level 19+ (Android 4.4)
- JavaScript habilitado en WebView
- Soporte para CSS custom properties (CSS variables)
- Viewport meta tag configurado

### Viewport Meta Tag (en index.html)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, 
  viewport-fit=cover, user-scalable=no">
```

## Debugging

### Habilitar Chrome DevTools en Android

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

### Consejos de Debugging

1. Abre Chrome en tu PC
2. Ve a `chrome://inspect`
3. Selecciona tu WebView
4. Abre DevTools

### Logs en Consola

La app registra eventos de refresco:

```javascript
console.log('Native refresh endpoint available:', 
  !!window.__TRUSTIFY_NATIVE__);
```

## Performance Optimization

- Lazy loading de componentes con `React.lazy`
- Code splitting por ruta
- Caching de datos locales
- Debouncing de búsquedas

## Manifest (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<application>
  <activity
    android:name=".YourActivity"
    android:configChanges="orientation|screenSize|keyboardHidden"
    android:hardwareAccelerated="true">
  </activity>
</application>
```

## Soporte Offline

Para agregar soporte offline futuro, considera usar Service Workers:

```javascript
// En main.jsx, después de que cargue la app
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## Contacto y Soporte

Para problemas específicos de WebView en Android, consulta:
- [Android WebView Documentation](https://developer.android.com/reference/android/webkit/WebView)
- [Chrome DevTools Remote Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)