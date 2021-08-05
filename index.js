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
  androidHardwareAccelerationDisabled = false,
  autoClear = false,
  backgroundColor = "",
  bgHeight = 0,
  bgWidth = 0,
  bgSrc = null,
  clearText = "Clear",
  confirmText = "Confirm",
  customHtml = null,
  dataURL = "",
  descriptionText = "Sign above",
  dotSize = null,
  imageType = "",
  minWidth = 0.5,
  maxWidth = 2.5,
  onOK = () => {},
  onEmpty = () => {},
  onClear = () => {},
  onUndo=()=>{},
  onRedo=()=>{},
  onDraw=()=>{},
  onErase=()=>{},
  onGetData=()=>{},
  onChangePenColor=()=>{},
  onChangePenSize=()=>{},
  onBegin = () => {},
  onEnd = () => {},
  overlayHeight = 0,
  overlayWidth = 0,
  overlaySrc = null,
  penColor = "",
  rotated = false,
  style = null,
  scrollable = false,
  trimWhitespace = false,
  webStyle = "",
  webviewContainerStyle = null,
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
    injectedJavaScript = injectedJavaScript.replace(/<%maxWidth%>/g, maxWidth);
    
    let html = htmlContentValue(injectedJavaScript);
    html = html.replace(/<%bgWidth%>/g, bgWidth);
    html = html.replace(/<%bgHeight%>/g, bgHeight);
    html = html.replace(/<%bgSrc%>/g, bgSrc);
    html = html.replace(/<%overlayWidth%>/g, overlayWidth);
    html = html.replace(/<%overlayHeight%>/g, overlayHeight);
    html = html.replace(/<%overlaySrc%>/g, overlaySrc);
    html = html.replace(/<%style%>/g, webStyle);
    html = html.replace(/<%description%>/g, descriptionText);
    html = html.replace(/<%confirm%>/g, confirmText);
    html = html.replace(/<%clear%>/g, clearText);
    html = html.replace(/<%orientation%>/g, rotated);

    return { html };
  }, [customHtml, autoClear, trimWhitespace, rotated, imageType, webStyle, descriptionText, confirmText, clearText, dataURL])
  
  const isJson = (str)=> {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
   }

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
      case "UNDO":
        onUndo();
        break;
      case "REDO":
        onRedo();
        break;
      case "DRAW":
        onDraw();
        break;
      case "ERASE":
        onErase();
        break;
      case "CHANGE_PEN":
        onChangePenColor();
        break;
      case "CHANGE_PEN_SIZE":
        onChangePenSize();
        break;
      default:
        isJson(e.nativeEvent.data)? onGetData(e.nativeEvent.data): onOK(e.nativeEvent.data);
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
    },
    undo: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("undo();true;");
      }
    },
    redo: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("redo();true;");
      }
    },
    draw: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("draw();true;");
      }
    },
    erase: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("erase();true;");
      }
    },
    changePenColor: (color) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("changePenColor('"+color+"');true;");
      }
    },
    changePenSize: (minW, maxW) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("changePenSize("+minW+','+maxW+");true;");
      }
    },
    getData: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript("getData();true;");
      }
    }
  }), [webViewRef]);

  const renderError = ({nativeEvent}) => console.warn("WebView error: ", nativeEvent);

  return (
    <View style={[styles.webBg, style]}>
      <WebView
        bounces={false}
        style={[webviewContainerStyle]}
        scrollEnabled={scrollable}
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
