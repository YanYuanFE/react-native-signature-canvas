import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Button,
    WebView,
    Platform
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';

import htmlContent from './h5/html';
import injectedSignaturePad from './h5/js/signature_pad';
import injectedApplication from './h5/js/app';

const styles = StyleSheet.create({
    signature:{
        width:200,
        height:110,
        borderWidth:2,
        borderColor:'grey'
    },
    signaturBg: {
        alignItems:'center',
        marginTop:20
    },
    webView :{
    },
    webBg: {
        backgroundColor:'red',
        flex:1
    }
});

class SignatureView extends Component {

    static defaultProps = {
        style: styles.webView,
        webBgStyle: styles.webBg,
        activeOpacity: 0.8
    }

    constructor(props) {
        super(props);
        this.state = {base64DataUrl: props.dataURL || null};
        const { backgroundColor } = StyleSheet.flatten(props.style);
        const injectedJavaScript = injectedSignaturePad + injectedApplication;
        const html = htmlContent(injectedJavaScript);
        this.source = {html};
    }

    state = {
        bridgeJs: `
        (function ready() {
          saveButton.addEventListener("click", function (event) {
            if (signaturePad.isEmpty()) {
                alert("Please provide signature first.");
            } else {
                window.postMessage(signaturePad.toDataURL());
            }
          });
        })();`
    }

    static  navigationOptions = ({navigation}) => ({
        title:navigation.state.params.title,
        mode:'modal',
        headerTitleStyle: {marginLeft:(Platform.OS === 'ios')?0:106},
    })

    getSignature = (e) => {
        const {navigate,goBack,state} = this.props.navigation;
        state.params.callback(e.nativeEvent.data);
        goBack();
        // callback(e.nativeEvent.data);
    }

    _renderError = (args) => {
        console.log('error', args)
        alert(JSON.stringify(args));
    };

    render(){
        let { callback, webBgStyle, style, activeOpacity } = this.props;
        const source = (Platform.OS == 'ios') ? require('./h5/index.html') : { uri: 'file:///android_asset/h5/index.html' }
        return(
            <View style={styles.webBg}>
                <WebView
                    style={styles.webView}
                    source={this.source}
                    onMessage={this.getSignature}
                    javaScriptEnabled={true}
                    onError={this._renderError}
                />
            </View>
        )
    }
}


export default SignatureView;
