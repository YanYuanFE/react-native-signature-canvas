import React, { useState, useMemo, useRef } from "react";
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

var webViewRef;

const SignatureView = ({
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
  sendOnEnd = false,
  autoClear = false,
  imageType = "",
  dataURL = "",
}) => {
  const [loading, setLoading] = useState(true);
  webViewRef = useRef();
  const source = useMemo(() => {
    let injectedJavaScript = injectedSignaturePad + injectedApplication;
    const htmlContentValue = customHtml ? customHtml : htmlContent;
    injectedJavaScript = injectedJavaScript.replace("<%autoClear%>", autoClear);
    injectedJavaScript = injectedJavaScript.replace("<%imageType%>", imageType);
    injectedJavaScript = injectedJavaScript.replace("<%dataURL%>", dataURL);
    
    let html = htmlContentValue(injectedJavaScript);
    html = html.replace("<%style%>", webStyle);
    html = html.replace("<%description%>", descriptionText);
    html = html.replace("<%confirm%>", confirmText);
    html = html.replace("<%clear%>", clearText);

    return { html };
  }, [customHtml, autoClear, imageType, webStyle, descriptionText, confirmText, clearText])

  const getSignature = e => {
    switch (e.nativeEvent.data) {
      case "BEGIN":
        onBegin();
        break;
      // case "END":
      //   onEnd(e.nativeEvent.data);
      //   break;
      case "EMPTY":
        onEmpty();
        break;
      case "CLEAR":
        onClear();
        break;
      default:
        if (onEnd && sendOnEnd)
          onEnd(e.nativeEvent.data)
        else if (onEnd && !sendOnEnd) {
          onEnd("END");
        }
        else
          onOK(e.nativeEvent.data);
    }
  };

  const renderError = e => {
    const { nativeEvent } = e;
    console.warn("WebView error: ", nativeEvent);
  };

  return (
    <View style={styles.webBg}>
      <WebView
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
}

export default SignatureView;

export function readSignature() {
  if (webViewRef.current) {
    webViewRef.current.injectJavaScript("readSignature();true;");
  }
}
export function clearSignature() {
  if (webViewRef.current) {
    webViewRef.current.injectJavaScript("clearSignature();true;");
  }
}
