declare module "react-native-signature-canvas" {
  import React from "react";
  import { StyleProp, ViewStyle } from "react-native";
  import { WebViewProps } from "react-native-webview";

  // Enhanced type definitions with better error handling

  type ImageType = "image/png" | "image/jpeg" | "image/svg+xml";

  type DataURL = string; // Simplified - should be base64 data URL

  type ForwardRef<T, P> = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P> & React.RefAttributes<T>
  >;

  // Enhanced callback types
  type SignatureCallback = (signature: string) => void;
  type EmptyCallback = () => void;
  type ErrorCallback = (error: Error) => void;

  export type SignatureViewProps = {
    androidHardwareAccelerationDisabled?: boolean;
    autoClear?: boolean;
    backgroundColor?: string;
    bgHeight?: number;
    bgWidth?: number;
    bgSrc?: string;
    clearText?: string;
    confirmText?: string;
    customHtml?: (injectedJavaScript: string) => string;
    dataURL?: DataURL;
    descriptionText?: string;
    dotSize?: number;
    imageType?: ImageType;
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    onError?: ErrorCallback; // Added missing prop
    nestedScrollEnabled?: boolean;
    showsVerticalScrollIndicator?: boolean;
    onOK?: SignatureCallback;
    onEmpty?: EmptyCallback;
    onClear?: EmptyCallback;
    onUndo?: EmptyCallback;
    onRedo?: EmptyCallback;
    onDraw?: EmptyCallback;
    onErase?: EmptyCallback;
    onGetData?: (data: string) => void; // Should be JSON string
    onChangePenColor?: EmptyCallback;
    onChangePenSize?: EmptyCallback;
    onBegin?: EmptyCallback;
    onEnd?: EmptyCallback;
    onLoadEnd?: EmptyCallback;
    onError?: ErrorCallback; // Added missing error callback
    overlayHeight?: number;
    overlayWidth?: number;
    overlaySrc?: string;
    penColor?: string;
    rotated?: boolean;
    style?: StyleProp<ViewStyle>;
    scrollable?: boolean;
    trimWhitespace?: boolean;
    webStyle?: string;
    webviewContainerStyle?: StyleProp<ViewStyle>;
    androidLayerType?: "none" | "software" | "hardware";
    webviewProps?: Partial<WebViewProps>;
  };

  export type SignatureViewRef = {
    changePenColor: (color: string) => void;
    changePenSize: (minW: number, maxW: number) => void;
    clearSignature: () => void;
    draw: () => void;
    erase: () => void;
    getData: () => void;
    readSignature: () => void;
    undo: () => void;
    redo: () => void;
    fromData: (pointGroups, suppressClear = false) => void;
    // Removed cropWhitespace as it's not exposed in the component
  };

  // Enhanced component interface with better type safety
  interface SignatureCanvasComponent
    extends ForwardRef<SignatureViewRef, SignatureViewProps> {
    displayName?: string;
  }

  const SignatureView: SignatureCanvasComponent;
  export default SignatureView;

  // Export additional types for external use
  export { SignatureViewProps, SignatureViewRef, ImageType, DataURL };
}
