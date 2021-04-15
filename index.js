import React, { useState, useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import htmlContent from "./h5/html";
import injectedSignaturePad from "./h5/js/signature_pad";
import injectedApplication from "./h5/js/app";

import { WebView } from "react-native-webview";

const styles = StyleSheet.create({
  webBg: {
    width: "100%",
    backgroundColor: "#FFF",
    flex: 1
  },
  loadingOverlayContainer: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "center", justifyContent: "center" },
});

const SignatureView = forwardRef(({
  webStyle = "",
  onOK = () => { },
  onEmpty = () => { },
  onClear = () => { },
  onBegin = () => { },
  onEnd = () => { },
  descriptionText = "Sign above",
  clearText = "Clear",
  confirmText = "Confirm",
  customHtml = null,
  autoClear = false,
  trimWhitespace = false,
  rotated = false,
  imageType = "",
  dataURL = "",
  penColor = "",
  backgroundColor = "",
  dotSize = 0,
  minWidth = 0.5,
  androidHardwareAccelerationDisabled = false,
  style = null,
}, ref) => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef();
  const source = useMemo(() => {
    let injectedJavaScript = injectedSignaturePad + injectedApplication;
    const htmlContentValue = customHtml ? customHtml : htmlContent;
    injectedJavaScript = injectedJavaScript.replace(/<%autoClear%>/g, autoClear);
    injectedJavaScript = injectedJavaScript.replace(/<%trimWhitespace%>/g, trimWhitespace);
    injectedJavaScript = injectedJavaScript.replace(/<%imageType%>/g, imageType);
    injectedJavaScript = injectedJavaScript.replace(/<%dataURL%>/g, dataURL);
    injectedJavaScript = injectedJavaScript.replace(/<%penColor%>/g, penColor);
    injectedJavaScript = injectedJavaScript.replace(/<%backgroundColor%>/g, backgroundColor);
    injectedJavaScript = injectedJavaScript.replace(/<%dotSize%>/g, dotSize);
    injectedJavaScript = injectedJavaScript.replace(/<%minWidth%>/g, minWidth);
    
    let html = htmlContentValue(injectedJavaScript);
    html = html.replace(/<%style%>/g, webStyle);
    html = html.replace(/<%description%>/g, descriptionText);
    html = html.replace(/<%confirm%>/g, confirmText);
    html = html.replace(/<%clear%>/g, clearText);
    html = html.replace(/<%orientation%>/g, rotated);

    return { html };
  }, [customHtml, autoClear, trimWhitespace, rotated, imageType, webStyle, descriptionText, confirmText, clearText, dataURL])

  const getSignature = e => {
    switch (e.nativeEvent.data) {
      case "BEGIN":
        onBegin();
        break;
      case "END":
        onEnd();
        break;
      case "EMPTY":
        onEmpty();
        break;
      case "CLEAR":
        onClear();
        break;
      default:
        onOK(e.nativeEvent.data);
    }
  };

  useImperativeHandle(ref, () => ({
    readSignature: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("readSignature();true;");
      }
    },
    clearSignature: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("clearSignature();true;");
      }
    }
  }), [webViewRef]);

  const renderError = e => {
    const { nativeEvent } = e;
    console.warn("WebView error: ", nativeEvent);
  };

  return (
    <View style={[styles.webBg, style]}>
      <WebView
        bounces={false}
        androidHardwareAccelerationDisabled={androidHardwareAccelerationDisabled}
        ref={webViewRef}
        useWebKit={true}
        source={source}
        onMessage={getSignature}
        javaScriptEnabled={true}
        onError={renderError}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && <View style={styles.loadingOverlayContainer}>
        <ActivityIndicator />
      </View>}
    </View>
  );
})

export default SignatureView;
