import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import htmlContent from './h5/html';
import injectedSignaturePad from './h5/js/signature_pad';
import injectedApplication from './h5/js/app';

import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  webBg: {
    width: '100%',
    backgroundColor: '#FFF',
    flex: 1
  }
});

class SignatureView extends Component {
  static defaultProps = {
    webStyle: '',
    onOK: () => { },
    onEmpty: () => { },
    descriptionText: 'Sign above',
    clearText: 'Clear',
    confirmText: 'Confirm',
  };

  constructor(props) {
    super(props);
    const { descriptionText, clearText, confirmText, emptyText, webStyle } = props;
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
    const { onOK, onEmpty } = this.props;
    if (e.nativeEvent.data === "EMPTY") {
      onEmpty();
    } else {
      onOK(e.nativeEvent.data);
    }
  };

  renderError = e => {
    const { nativeEvent } = e;
    console.warn('WebView error: ', nativeEvent);
  };

  render() {
    return (
      <View style={styles.webBg}>
        <WebView
          useWebKit={true}
          source={this.source}
          onMessage={this.getSignature}
          javaScriptEnabled={true}
          onError={this.renderError}
        />
      </View>
    );
  }
}

export default SignatureView;
