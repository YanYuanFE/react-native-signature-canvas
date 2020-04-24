import React, { useState, useMemo } from "react";
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

const SignatureView = ({
  webStyle = "",
  onOK = () => { },
  onEmpty = () => { },
  descriptionText = "Sign above",
  clearText = "Clear",
  confirmText = "Confirm",
  customHtml = null,
  autoClear = false,
  imageType = "",
}) => {
  const [loading, setLoading] = useState(true);

  const source = useMemo(() => {
    let injectedJavaScript = injectedSignaturePad + injectedApplication;
    const htmlContentValue = customHtml ? customHtml : htmlContent;
    injectedJavaScript = injectedJavaScript.replace("<%autoClear%>", autoClear);
    injectedJavaScript = injectedJavaScript.replace("<%imageType%>", imageType);
    let html = htmlContentValue(injectedJavaScript);
    html = html.replace("<%style%>", webStyle);
    html = html.replace("<%description%>", descriptionText);
    html = html.replace("<%confirm%>", confirmText);
    html = html.replace("<%clear%>", clearText);

    return { html };
  }, [customHtml, autoClear, imageType, webStyle, descriptionText, confirmText, clearText])

  const getSignature = e => {
    if (e.nativeEvent.data === "EMPTY") {
      onEmpty();
    } else {
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
