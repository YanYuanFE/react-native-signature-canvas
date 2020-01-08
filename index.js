import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import htmlContent from './h5/html';
import injectedSignaturePad from './h5/js/signature_pad';
import injectedApplication from './h5/js/app';

import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  webBg: {
    width: '100%',
    backgroundColor: '#FFF',
    flex: 1
  },
  loadingOverlayContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
});

class SignatureView extends Component {
  static defaultProps = {
    webStyle: '',
    onOK: () => { },
    onEmpty: () => { },
    descriptionText: 'Sign above',
    clearText: 'Clear',
    confirmText: 'Confirm',
    customHtml: null,
  };

  constructor(props) {
    super(props);
    const { descriptionText, clearText, confirmText, emptyText, webStyle } = props;
    this.state = {
      base64DataUrl: props.dataURL || null,
      isLoading: true,
    };

    const injectedJavaScript = injectedSignaturePad + injectedApplication;
    if (customHtml) {
      htmlContent = customHtml;
    }

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
          onLoadEnd={() => this.setState({ isLoading: false })}
        />
        {this.state.isLoading && <View style={styles.loadingOverlayContainer}>
          <ActivityIndicator />
        </View>}
      </View>
    );
  }
}

export default SignatureView;
