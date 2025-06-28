# WebView Props Configuration

The `react-native-signature-canvas` component now supports a `webviewProps` parameter that allows you to customize the underlying WebView behavior while maintaining the core signature functionality.

## Usage

```jsx
import SignatureCanvas from 'react-native-signature-canvas';

<SignatureCanvas
  // ... other props
  webviewProps={{
    // Any WebView props can be passed here
    cacheEnabled: false,
    allowsFullscreenVideo: false,
    decelerationRate: 'fast',
    // ... more WebView props
  }}
/>
```

## Core vs Customizable Props

### Core Props (Cannot be overridden)
These props are essential for the signature functionality and cannot be overridden via `webviewProps`:

- `ref` - Internal WebView reference
- `source` - HTML content for signature pad
- `onMessage` - Message handler for signature events
- `onError` - Error handler (enhanced with retry logic)
- `onLoadEnd` - Load completion handler
- `onLoadStart` - Load start handler  
- `onLoadProgress` - Load progress handler
- `javaScriptEnabled` - Must be true for signature pad to work
- `useWebKit` - Uses modern WebKit engine

### Default Props (Can be overridden)
These props have sensible defaults but can be customized via `webviewProps`:

#### Performance Optimizations
```jsx
webviewProps={{
  cacheEnabled: true, // Enable/disable WebView cache
  allowsInlineMediaPlayback: false, // Disable media playback
  mediaPlaybackRequiresUserAction: true, // Require user action for media
  allowsBackForwardNavigationGestures: false, // Disable navigation gestures
}}
```

#### Security Enhancements
```jsx
webviewProps={{
  allowsLinkPreview: false, // Disable link previews
  allowFileAccess: false, // Disable file access
  allowFileAccessFromFileURLs: false, // Disable file URL access
  allowUniversalAccessFromFileURLs: false, // Disable universal access
  mixedContentMode: "never", // Block mixed content
  originWhitelist: ['*'], // Allow all origins
}}
```

#### UI/UX Customization
```jsx
webviewProps={{
  bounces: false, // Disable bounce effect
  scrollEnabled: false, // Disable scrolling (use scrollable prop instead)
  decelerationRate: 'fast', // Scroll deceleration rate
  showsHorizontalScrollIndicator: false, // Hide horizontal scroll
  showsVerticalScrollIndicator: false, // Hide vertical scroll
}}
```

#### Android-Specific
```jsx
webviewProps={{
  androidLayerType: "hardware", // Use hardware acceleration
  androidHardwareAccelerationDisabled: false, // Enable hardware acceleration
}}
```

## Common Use Cases

### High Performance Mode
```jsx
<SignatureCanvas
  webviewProps={{
    cacheEnabled: true,
    androidLayerType: "hardware",
    androidHardwareAccelerationDisabled: false,
  }}
/>
```

### Low Memory Mode
```jsx
<SignatureCanvas
  webviewProps={{
    cacheEnabled: false,
    androidLayerType: "software",
    androidHardwareAccelerationDisabled: true,
  }}
/>
```

### Enhanced Security
```jsx
<SignatureCanvas
  webviewProps={{
    allowFileAccess: false,
    allowFileAccessFromFileURLs: false,
    allowUniversalAccessFromFileURLs: false,
    mixedContentMode: "never",
    originWhitelist: [], // Block all external origins
  }}
/>
```

### Custom Scrolling Behavior
```jsx
<SignatureCanvas
  webviewProps={{
    decelerationRate: 'normal',
    alwaysBounceVertical: false,
    alwaysBounceHorizontal: false,
    directionalLockEnabled: true,
  }}
/>
```

## Important Notes

1. **Core Functionality**: The `webviewProps` cannot override core functionality props. These are protected to ensure the signature canvas works correctly.

2. **Prop Priority**: User-provided `webviewProps` take precedence over default props but not core props.

3. **TypeScript Support**: The `webviewProps` parameter is fully typed with `Partial<WebViewProps>` from `react-native-webview`.

4. **Performance Impact**: Some WebView props can significantly impact performance. Test thoroughly when customizing performance-related settings.

5. **Platform Differences**: Some props may behave differently on iOS vs Android. Refer to the `react-native-webview` documentation for platform-specific behavior.

## Migration from Previous Versions

If you were previously using individual WebView-related props, you can now consolidate them under `webviewProps`:

### Before
```jsx
<SignatureCanvas
  androidLayerType="hardware"
  androidHardwareAccelerationDisabled={false}
  // other props...
/>
```

### After  
```jsx
<SignatureCanvas
  webviewProps={{
    androidLayerType: "hardware",
    androidHardwareAccelerationDisabled: false,
  }}
  // other props...
/>
```

Note: The old individual props are still supported for backward compatibility.