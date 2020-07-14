declare module "react-native-signature-canvas" {
  import React from "react";

  type ImageType = "image/jpeg" | "image/svg+xml";

  type DataURL = "Base64";

  interface SignatureScreenProps {
    ref: React.MutableRefObject<any>;
    webStyle?: string;
    onOK?: (signature: string) => void;
    onEmpty?: () => void;
    onClear?: () => void;
    onBegin?: () => void;
    onEnd?: () => void;
    descriptionText?: string;
    clearText?: string;
    confirmText?: string;
    customHtml?: string | null | undefined;
    autoClear?: boolean;
    imageType?: ImageType;
    dataURL?: DataURL;
  }
  
  const SignatureView: React.ForwardRefExoticComponent<SignatureScreenProps>;
  export = SignatureView;
}