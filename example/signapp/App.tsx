/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [signature, setSignature] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.preview}>
        {signature && (
          <Image style={styles.previewImage} source={{uri: signature}} />
        )}
      </View>
      <SignatureScreen
        onOK={setSignature}
        onEmpty={() => console.log('onEmpty')}
        onClear={() => setSignature('')}
        autoClear={true}
        imageType={'image/png'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
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
