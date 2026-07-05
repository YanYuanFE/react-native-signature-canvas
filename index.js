import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";

import htmlContent from "./h5/html";
import injectedSignaturePad from "./h5/js/signature_pad";
import injectedApplication from "./h5/js/app";

import { WebView } from "react-native-webview";

// Constants for better maintainability
const MESSAGE_TYPES = {
  BEGIN: "BEGIN",
  END: "END",
  EMPTY: "EMPTY",
  CLEAR: "CLEAR",
  UNDO: "UNDO",
  REDO: "REDO",
  DRAW: "DRAW",
  ERASE: "ERASE",
  CHANGE_PEN: "CHANGE_PEN",
  CHANGE_PEN_SIZE: "CHANGE_PEN_SIZE"
};

const styles = StyleSheet.create({
  webBg: {
    width: "100%",
    backgroundColor: "transparent",
    flex: 1,
  },
  loadingOverlayContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

// JSON.stringify produces a valid JS literal with quotes/backslashes/newlines escaped
const getParamForInjection = (param) =>
  typeof param === "string" || typeof param === "object"
    ? JSON.stringify(param)
    : param;

const SignatureView = forwardRef(
  (
    {
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
      minDistance = 5,
      nestedScrollEnabled = false,
      showsVerticalScrollIndicator = true,
      onOK = () => { },
      onEmpty = () => { },
      onClear = () => { },
      onUndo = () => { },
      onRedo = () => { },
      onDraw = () => { },
      onErase = () => { },
      onGetData = () => { },
      onChangePenColor = () => { },
      onChangePenSize = () => { },
      onBegin = () => { },
      onEnd = () => { },
      onLoadEnd = () => { },
      onError = () => { },
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
      androidLayerType = "hardware",
      webviewProps = {},
    },
    ref
  ) => {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    // Key to force WebView remount when needed (e.g., after content process termination)
    const [webViewKey, setWebViewKey] = useState(0);
    const maxRetries = 3;
    const webViewRef = useRef();
    // Store dataURL for injection - updates when dataURL prop changes
    const currentDataURLRef = useRef(dataURL);

    // Update ref when dataURL prop changes
    useEffect(() => {
      currentDataURLRef.current = dataURL;
    }, [dataURL]);

    // Split source generation for better performance
    // Include webViewKey to regenerate script when WebView needs remounting
    const injectedScript = useMemo(() => {
      // String values go through a function replacer so "$&"-style patterns
      // in user input are inserted literally instead of being expanded
      let script = injectedSignaturePad + injectedApplication;
      script = script.replace(/<%autoClear%>/g, autoClear);
      script = script.replace(/<%trimWhitespace%>/g, trimWhitespace);
      script = script.replace(/<%imageType%>/g, () => imageType || "image/png");
      // Use currentDataURLRef to get the latest dataURL value;
      // JSON.stringify emits a quoted JS string literal with escaping
      script = script.replace(/<%dataURL%>/g, () => JSON.stringify(currentDataURLRef.current || ""));
      script = script.replace(/<%penColor%>/g, () => penColor || "black");
      script = script.replace(/<%backgroundColor%>/g, () => backgroundColor || "rgba(255,255,255,0)");
      script = script.replace(/<%dotSize%>/g, dotSize ?? "null");
      script = script.replace(/<%minWidth%>/g, minWidth ?? 0.5);
      script = script.replace(/<%maxWidth%>/g, maxWidth ?? 2.5);
      script = script.replace(/<%minDistance%>/g, minDistance ?? 5);
      script = script.replace(/<%orientation%>/g, rotated || false);
      return script;
    }, [autoClear, trimWhitespace, imageType, penColor, backgroundColor, dotSize, minWidth, maxWidth, minDistance, rotated, webViewKey]);

    const source = useMemo(() => {
      const htmlContentValue = customHtml || htmlContent;
      let html = htmlContentValue(injectedScript);
      html = html.replace(/<%bgWidth%>/g, bgWidth ?? 0);
      html = html.replace(/<%bgHeight%>/g, bgHeight ?? 0);
      html = html.replace(/<%bgSrc%>/g, () => bgSrc || "null");
      html = html.replace(/<%overlayWidth%>/g, overlayWidth ?? 0);
      html = html.replace(/<%overlayHeight%>/g, overlayHeight ?? 0);
      html = html.replace(/<%overlaySrc%>/g, () => overlaySrc || "null");
      html = html.replace(/<%style%>/g, () => webStyle || "");
      html = html.replace(/<%description%>/g, () => descriptionText || "Sign above");
      html = html.replace(/<%confirm%>/g, () => confirmText || "Confirm");
      html = html.replace(/<%clear%>/g, () => clearText || "Clear");
      html = html.replace(/<%orientation%>/g, rotated || false);

      return { html };
    }, [injectedScript, customHtml, bgWidth, bgHeight, bgSrc, overlayWidth, overlayHeight, overlaySrc, webStyle, descriptionText, confirmText, clearText, rotated]);

    // Handle dataURL changes dynamically without reloading WebView
    const prevDataURLRef = useRef(dataURL);

    useEffect(() => {
      // Skip if dataURL hasn't changed or WebView isn't ready
      if (prevDataURLRef.current === dataURL || !webViewRef.current || loading) {
        return;
      }

      prevDataURLRef.current = dataURL;

      // Update dataURL in WebView without full reload
      if (dataURL) {
        const script = `
          dataURL = ${JSON.stringify(dataURL)};
          if (signaturePad && signaturePad.isEmpty()) {
            signaturePad.fromDataURL(dataURL);
          }
          true;
        `;
        try {
          webViewRef.current.injectJavaScript(script);
        } catch (error) {
          console.warn("Failed to update dataURL:", error);
        }
      }
    }, [dataURL, loading]);

    const isJson = (str) => {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    };

    // Enhanced message handling with error handling
    const getSignature = useCallback((e) => {
      if (!e?.nativeEvent?.data) {
        console.warn("Invalid message received from WebView");
        return;
      }

      const data = e.nativeEvent.data;

      try {
        switch (data) {
          case MESSAGE_TYPES.BEGIN:
            onBegin();
            break;
          case MESSAGE_TYPES.END:
            onEnd();
            break;
          case MESSAGE_TYPES.EMPTY:
            onEmpty();
            break;
          case MESSAGE_TYPES.CLEAR:
            onClear();
            break;
          case MESSAGE_TYPES.UNDO:
            onUndo();
            break;
          case MESSAGE_TYPES.REDO:
            onRedo();
            break;
          case MESSAGE_TYPES.DRAW:
            onDraw();
            break;
          case MESSAGE_TYPES.ERASE:
            onErase();
            break;
          case MESSAGE_TYPES.CHANGE_PEN:
            onChangePenColor();
            break;
          case MESSAGE_TYPES.CHANGE_PEN_SIZE:
            onChangePenSize();
            break;
          default:
            if (isJson(data)) {
              onGetData(data);
            } else if (typeof data === "string" && data.startsWith("data:")) {
              onOK(data);
            } else {
              console.warn("Unknown message type:", data);
            }
        }
      } catch (error) {
        console.error("Error handling WebView message:", error);
      }
    }, [onBegin, onEnd, onEmpty, onClear, onUndo, onRedo, onDraw, onErase, onChangePenColor, onChangePenSize, onGetData, onOK]);

    // Enhanced WebView method execution with error handling
    const executeWebViewMethod = useCallback((method, params = []) => {
      if (!webViewRef.current) {
        console.warn(`WebView ref is null when calling ${method}`);
        return;
      }

      try {
        const script = params.length > 0
          ? `${method}(${params.map(getParamForInjection).join(',')});true;`
          : `${method}();true;`;
        webViewRef.current.injectJavaScript(script);
      } catch (error) {
        console.error(`Error executing WebView method ${method}:`, error);
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        readSignature: () => executeWebViewMethod('readSignature'),
        clearSignature: () => executeWebViewMethod('clearSignature'),
        undo: () => executeWebViewMethod('undo'),
        redo: () => executeWebViewMethod('redo'),
        draw: () => executeWebViewMethod('draw'),
        erase: () => executeWebViewMethod('erase'),
        changePenColor: (color) => {
          if (typeof color !== 'string') {
            console.warn('changePenColor: color must be a string');
            return;
          }
          executeWebViewMethod('changePenColor', [color]);
        },
        changePenSize: (minW, maxW) => {
          if (typeof minW !== 'number' || typeof maxW !== 'number') {
            console.warn('changePenSize: minW and maxW must be numbers');
            return;
          }
          executeWebViewMethod('changePenSize', [minW, maxW]);
        },
        getData: () => executeWebViewMethod('getData'),
        fromData: (pointGroups, suppressClear = false) => {
          if (!pointGroups) {
            console.warn('fromData: pointGroups must be an array');
            return;
          }
          executeWebViewMethod('fromData', [pointGroups, suppressClear]);
        },
        // New method to set dataURL without causing WebView reload
        setDataURL: (url) => {
          if (typeof url !== 'string') {
            console.warn('setDataURL: url must be a string');
            return;
          }
          if (!webViewRef.current) {
            console.warn('WebView ref is null when calling setDataURL');
            return;
          }
          const script = `
            dataURL = ${JSON.stringify(url)};
            if (signaturePad) {
              signaturePad.clear();
              if (dataURL) {
                signaturePad.fromDataURL(dataURL);
              }
            }
            true;
          `;
          try {
            webViewRef.current.injectJavaScript(script);
          } catch (error) {
            console.error('Error executing setDataURL:', error);
          }
        },
        // Force reinitialize WebView - useful for bottom sheets/modals where WebView state is lost
        reinitialize: () => {
          setLoading(true);
          setHasError(false);
          setWebViewKey(prev => prev + 1);
        },
      }),
      [executeWebViewMethod]
    );

    const renderError = useCallback(({ nativeEvent }) => {
      console.error("WebView error: ", nativeEvent);
      setHasError(true);

      // Call user-provided error handler
      try {
        onError(new Error(`WebView error: ${nativeEvent.description || nativeEvent.code}`));
      } catch (err) {
        console.warn('Error in onError callback:', err);
      }

      // Attempt to recover from error with retry logic
      if (webViewRef.current && nativeEvent.code !== -999 && retryCount < maxRetries) {
        setTimeout(() => {
          try {
            setRetryCount(prev => prev + 1);
            webViewRef.current.reload();
            setHasError(false);
          } catch (error) {
            console.error("Failed to reload WebView after error:", error);
          }
        }, Math.min(1000 * Math.pow(2, retryCount), 5000)); // Exponential backoff
      }
    }, [onError, retryCount, maxRetries]);

    // Handle iOS WebView content process termination (WKWebView can be killed when app is backgrounded)
    // This is crucial for bottom sheets and modals where the component stays mounted but WebView is killed
    const handleContentProcessDidTerminate = useCallback(() => {
      console.warn("WebView content process terminated, reinitializing...");
      setLoading(true);
      setHasError(false);
      // Increment key to force WebView remount with fresh JavaScript context
      setWebViewKey(prev => prev + 1);
    }, []);

    const handleLoadEnd = useCallback(() => {
      setLoading(false);
      setHasError(false);
      setRetryCount(0);

      try {
        onLoadEnd();
      } catch (error) {
        console.warn('Error in onLoadEnd callback:', error);
      }
    }, [onLoadEnd]);

    // Performance monitoring
    const handleLoadStart = useCallback(() => {
      setLoading(true);
    }, []);

    const handleLoadProgress = useCallback(({ nativeEvent }) => {
      // Optional: Add progress monitoring
      if (nativeEvent.progress === 1) {
        setLoading(false);
      }
    }, []);

    return (
      <View style={[styles.webBg, style]}>
        <WebView
          // Default component props (can be overridden by webviewProps)
          bounces={false}
          style={[{ flex: 1 }, webviewContainerStyle]}
          scrollEnabled={scrollable}
          androidLayerType={androidLayerType}
          androidHardwareAccelerationDisabled={
            androidHardwareAccelerationDisabled
          }
          nestedScrollEnabled={nestedScrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          // Default performance optimizations
          cacheEnabled={true}
          allowsInlineMediaPlayback={false}
          mediaPlaybackRequiresUserAction={true}
          allowsBackForwardNavigationGestures={false}
          // Default security enhancements
          allowsLinkPreview={false}
          allowFileAccess={false}
          allowFileAccessFromFileURLs={false}
          allowUniversalAccessFromFileURLs={false}
          mixedContentMode="never"
          originWhitelist={['*']}
          // Default error recovery
          startInLoadingState={true}
          // User-provided WebView props (can override defaults but not core functionality)
          {...webviewProps}
          // Core functionality props (cannot be overridden — placed after the spread)
          // Key for forcing remount when WebView needs reinitialization
          key={`signature-webview-${webViewKey}`}
          ref={webViewRef}
          source={source}
          onMessage={getSignature}
          onError={renderError}
          onLoadEnd={handleLoadEnd}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          // Handle iOS WKWebView content process termination (crucial for bottom sheets/modals)
          onContentProcessDidTerminate={handleContentProcessDidTerminate}
          javaScriptEnabled={true}
          useWebKit={true}
        />
        {(loading || hasError) && (
          <View style={styles.loadingOverlayContainer}>
            {hasError ? (
              <Text style={{ color: '#ff0000', textAlign: 'center', padding: 10 }}>
                Error loading signature pad{retryCount > 0 ? ` (Retry ${retryCount}/${maxRetries})` : ''}
              </Text>
            ) : (
              <ActivityIndicator color={"#007AFF"} size="small" />
            )}
          </View>
        )}
      </View>
    );
  }
);

export default SignatureView;
