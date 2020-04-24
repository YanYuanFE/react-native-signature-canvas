import React, {useState} from 'react';
import { StyleSheet, TextInput, View, Image } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

const App = () => {
  const [signature, setSign] = useState(null);
  const [value, onChangeText] = useState('Useless Placeholder');
  const [desc, setDesc] = useState("please sign");

  const handleSignature = signature => {
    console.log(signature);
    setSign(signature);
    setDesc("sign success");
  };

  const handleEmpty = () => {
    console.log('Empty');
  }

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => onChangeText(text)}
      value={value}
    />
      <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 114 }}
            source={{ uri: signature }}
          />
        ) : null}
      </View>
      <SignatureScreen 
      onOK={handleSignature} 
      onEmpty={handleEmpty} 
      autoClear={true} 
      descriptionText={desc}
       />
    </View>
  );
}

export default App;

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