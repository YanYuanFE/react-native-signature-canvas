# react-native-signature-canvas
React Native Signature Component based Canvas for Android &amp;&amp; IOS &amp;&amp; expo

- Supports Android and iOS and Expo
- Pure JavaScript implementation with no native dependencies
- Tested with RN 0.50
- Only depend on react and react native and react-navigation
- Generates a base64 encoded png image of the signature

## Installation

```sh
npm install --save react-native-signature-canvas
```

## Example

```js
import SinatureScreen from 'react-native-signature-canvas';
const ROUTES = {
    // other screen
    SinatureScreen
}
const AppNavigator = StackNavigator(
    {
        ...ROUTES
        // ,
        // Index: {
        //     screen: Index,
        // },
    },
    {
        initialRouteName: 'TabScreen',
        mode: Platform.OS === 'ios' ? 'modal' : 'card',
        cardStyle: {
            backgroundColor: '#fff'
        }
    }
);

import React from 'react';
import {StyleSheet} from 'react-native';
var {
  View,
  Component,
} = React;

export default class Demo extends Component {
  startSignature = () => {
    this.props.navigation.navigate("SinatureScreen", {
        title: "签字",
        callback: (data) => {
          this.setState({
              signature: data
          });
        }
    });
  }

  render = () => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.preview}>
            {this.state.signature ? <Image
                resizeMode={'contain'}
                style={{ width: 335, height: 114 }}
                source={{ uri: this.state.signature }}
            /> : null}
        </View>
        <Text style={styles.previewText} onPress={this.startSignature}>开始签字</Text>
      </View>
    )
  };
}

export const styles = StyleSheet.create({
  preview: {
    width: 335,
    height: 114,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  previewText: {
    color: '#FFF',
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#69B2FF',
    width: 120,
    textAlign: 'center',
    marginTop: 10,
  },
})
```