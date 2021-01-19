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
}, ref) => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef();
  const source = useMemo(() => {
    let injectedJavaScript = injectedSignaturePad + injectedApplication;
    const htmlContentValue = customHtml ? customHtml : htmlContent;
    injectedJavaScript = injectedJavaScript.replaceAll("<%autoClear%>", autoClear);
    injectedJavaScript = injectedJavaScript.replaceAll("<%trimWhitespace%>", trimWhitespace);
    injectedJavaScript = injectedJavaScript.replaceAll("<%imageType%>", imageType);
    injectedJavaScript = injectedJavaScript.replaceAll("<%dataURL%>", dataURL);
    injectedJavaScript = injectedJavaScript.replaceAll("<%penColor%>", penColor);
    injectedJavaScript = injectedJavaScript.replaceAll("<%backgroundColor%>", backgroundColor);
    injectedJavaScript = injectedJavaScript.replaceAll("<%dotSize%>", dotSize);
    injectedJavaScript = injectedJavaScript.replaceAll("<%minWidth%>", minWidth);
    injectedJavaScript = injectedJavaScript.replaceAll("<%orientation%>", rotated);
    
    let html = htmlContentValue(injectedJavaScript);
    html = html.replaceAll("<%style%>", webStyle);
    html = html.replaceAll("<%description%>", descriptionText);
    html = html.replaceAll("<%confirm%>", confirmText);
    html = html.replaceAll("<%clear%>", clearText);
    html = html.replaceAll("<%orientation%>", rotated?'rotated':'');

    return { html };
  }, [customHtml, autoClear, trimWhitespace, rotated, imageType, webStyle, descriptionText, confirmText, clearText])

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
    <View style={styles.webBg}>
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
