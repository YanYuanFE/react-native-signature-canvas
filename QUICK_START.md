# Quick Start Guide

Get up and running with `react-native-signature-canvas` in minutes!

## 🚀 Installation

```bash
# Install the package
npm install react-native-signature-canvas

# For React Native CLI projects, also install WebView
npm install react-native-webview
cd ios && pod install # iOS only
```

## 📱 Basic Example

```jsx
import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

export default function App() {
  const ref = useRef();
  const [signature, setSignature] = useState();

  const handleOK = (signature) => {
    console.log(signature);
    setSignature(signature);
  };

  const handleClear = () => {
    ref.current?.clearSignature();
  };

  const handleSave = () => {
    ref.current?.readSignature();
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas
        ref={ref}
        onOK={handleOK}
        onEmpty={() => console.log('Empty')}
        descriptionText="Sign here"
        clearText="Clear"
        confirmText="Save"
        style={styles.signature}
      />
      
      <View style={styles.buttons}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
```

## ⚡ Enhanced Example with New Features

```jsx
import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

export default function EnhancedSignatureApp() {
  const ref = useRef();
  const [signature, setSignature] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignature = (signature) => {
    setSignature(signature);
    setIsLoading(false);
    Alert.alert('Success', 'Signature saved!');
  };

  const handleEmpty = () => {
    setIsLoading(false);
    Alert.alert('Empty', 'Please draw a signature first');
  };

  const handleError = (error) => {
    setIsLoading(false);
    Alert.alert('Error', error.message);
  };

  const handleSave = () => {
    setIsLoading(true);
    ref.current?.readSignature();
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas
        ref={ref}
        onOK={handleSignature}
        onEmpty={handleEmpty}
        onError={handleError}
        descriptionText="Sign here"
        clearText="Clear"
        confirmText={isLoading ? "Saving..." : "Save"}
        penColor="#0066cc"
        backgroundColor="rgba(255,255,255,0)"
        // NEW: WebView customization
        webviewProps={{
          cacheEnabled: true,
          androidLayerType: "hardware",
        }}
        style={styles.signature}
      />
      
      <View style={styles.controls}>
        <Button 
          title="Clear" 
          onPress={() => ref.current?.clearSignature()} 
        />
        <Button 
          title="Undo" 
          onPress={() => ref.current?.undo()} 
        />
        <Button 
          title="Save" 
          onPress={handleSave}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  signature: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingVertical: 10,
  },
});
```

## 🔧 Common Configurations

### High Performance Setup
```jsx
<SignatureCanvas
  webviewProps={{
    cacheEnabled: true,
    androidLayerType: "hardware",
    androidHardwareAccelerationDisabled: false,
  }}
/>
```

### Low Memory Setup
```jsx
<SignatureCanvas
  webviewProps={{
    cacheEnabled: false,
    androidLayerType: "software", 
    androidHardwareAccelerationDisabled: true,
  }}
/>
```

### Security Focused Setup
```jsx
<SignatureCanvas
  webviewProps={{
    allowFileAccess: false,
    allowFileAccessFromFileURLs: false,
    mixedContentMode: "never",
    allowsLinkPreview: false,
  }}
/>
```

## 📖 Next Steps

- [Read the full documentation](./README.md)
- [Learn about WebView customization](./WEBVIEW_PROPS.md)
- [Check out example apps](./example/)
- [View TypeScript definitions](./index.d.ts)

## 🆘 Need Help?

- [Check troubleshooting guide](./README.md#troubleshooting)
- [View common issues](https://github.com/YanYuanFE/react-native-signature-canvas/issues)
- [Ask questions in discussions](https://github.com/YanYuanFE/react-native-signature-canvas/discussions)