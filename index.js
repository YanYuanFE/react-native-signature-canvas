import React, { Component } from 'react';
import { View, StyleSheet, WebView } from 'react-native';

import htmlContent from './h5/html';
import injectedSignaturePad from './h5/js/signature_pad';
import injectedApplication from './h5/js/app';

const styles = StyleSheet.create({
  signature: {
    width: 200,
    height: 110,
    borderWidth: 2,
    borderColor: 'grey'
  },
  signaturBg: {
    alignItems: 'center',
    marginTop: 20
  },
  webView: {},
  webBg: {
    width: '100%',
    backgroundColor: '#FFF',
    flex: 1
  }
});

class SignatureView extends Component {
  static defaultProps = {
    webStyle: '',
    onOK: () => {},
    descriptionText: 'Sign above',
    clearText: 'Clear',
    confirmText: 'Confirm'
  };

  constructor(props) {
    super(props);
    const { descriptionText, clearText, confirmText, webStyle } = props;
    this.state = { 
      base64DataUrl: props.dataURL || null 
    };

    const injectedJavaScript = injectedSignaturePad + injectedApplication;
    let html = htmlContent(injectedJavaScript);
    html = html.replace('<%style%>', webStyle);
    html = html.replace('<%description%>', descriptionText);
    html = html.replace('<%confirm%>', confirmText);
    html = html.replace('<%clear%>', clearText);

    this.source = { html };
  };

  getSignature = e => {
    const { onOK } = this.props;
    onOK(e.nativeEvent.data);
  };

  _renderError = args => {
    console.log("error", args);
  };

  render() {
    return (
      <View style={styles.webBg}>
        <WebView
          style={styles.webView}
          source={this.source}
          onMessage={this.getSignature}
          javaScriptEnabled={true}
          onError={this._renderError}
        />
      </View>
    );
  }
}

export default SignatureView;
