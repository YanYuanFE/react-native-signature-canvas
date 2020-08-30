import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import SignatureScreen from 'react-native-signature-canvas';

const App: () => React$Node = () => {
  const [signature, setSignature] = useState(null);
  return (
    <>
      <View style={styles.preview}>
        {signature && (
          <Image style={styles.previewImage} source={{uri: signature}} />
        )}
      </View>
      <SignatureScreen
        onOK={setSignature}
        onEmpty={() => console.log('onEmpty')}
        onClear={() => setSignature(null)}
        autoClear={true}
        imageType={'image/png+xml'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  preview: {
    height: 114,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flex: 1,
  },
  previewImage: {
    width: 335,
    height: 114,
    resizeMode: 'contain',
  },
});

export default App;
