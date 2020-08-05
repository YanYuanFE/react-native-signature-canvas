import React, {useState} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';


export default function App() {
  const [signature, setSign] = useState<string | null>(null);
  const handleSignature = (signature: string) => {
    console.log(signature);
    setSign(signature);
  }
  const handleEmpty = () => {
    console.log('Empty');
  }


  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 50 }}
            source={{ uri: signature }}
          />
        ) : null}
      <SignatureScreen
          onOK={handleSignature} 
          onEmpty={handleEmpty}
          backgroundColor={"red"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
