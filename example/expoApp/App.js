import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signature: null };
  }

  handleSignature = signature => {
    console.log(signature);
    this.setState({ signature });
  };

  handleEmpty = () => {
    console.log('Empty');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.preview}>
          {this.state.signature ? (
            <Image
              resizeMode={"contain"}
              style={{ width: 335, height: 114 }}
              source={{ uri: this.state.signature }}
            />
          ) : null}
        </View>
        <SignatureScreen onOK={this.handleSignature} onEmpty={this.handleEmpty} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flex: 1,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10
  }
});